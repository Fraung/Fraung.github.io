import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {
    CloseEditor,
    CloseForePanel,
    ContentLoaded,
    ObjectDeselected,
    ObjectSelected,
    OpenEditor,
    OpenPanel,
    SetZoom
} from './editor-state-actions';
import {ObjectsState, ObjectsStateModel} from '../../image-editor-ui/state/objects/objects.state';
import {DrawerName} from '../../image-editor-ui/toolbar-controls/drawers/drawer-name.enum';
import {FilterState} from '../../image-editor-ui/state/filter/filter.state';
import {Settings} from '../../../common/core/config/settings.service';
import {EditorMode} from '../enums/editor-mode.enum';
import {PixieConfig} from '../default-settings';
import {EditorTheme} from '../enums/editor-theme.enum';
import {BreakpointsService} from '../../../common/core/ui/breakpoints.service';
import {ControlPosition} from '../enums/control-positions.enum';
import {ResizeState} from '../../image-editor-ui/state/resize/resize.state';
import {CropState} from '../../image-editor-ui/state/crop/crop.state';
import {ShapesState} from '../../image-editor-ui/state/shapes/shapes.state';
import {TransformState} from '../../image-editor-ui/state/transform/transform.state';
import {FrameState} from '../../image-editor-ui/state/frame/frame.state';
import {DrawState} from '../../image-editor-ui/state/draw/draw.state';
import {StickersState} from '../../image-editor-ui/state/stickers/stickers.state';
import {CornersState} from '../../image-editor-ui/state/corners/corners.state';
import {BackgroundState} from '../../image-editor-ui/state/background/background.state';
import {TextState} from '../../image-editor-ui/state/text/text.state';
import {ActiveObjectService} from '../canvas/active-object/active-object.service';
import {ObjectNames} from '../objects/object-names.enum';

interface EditorStateModel {
    visible: boolean;
    mode: EditorMode;
    theme: EditorTheme;
    hideToolbar: boolean;
    activePanel: DrawerName;
    controlsPosition: ControlPosition;
    contentLoaded: boolean;
    objectSettings?: ObjectsStateModel;
    activeObjIsText?: boolean;
    activeObjIsShape?: boolean;
    activeObjId?: string;
    zoom: number;
}

@State<EditorStateModel>({
    name: 'imageEditor',
    defaults: {
        visible: true,
        mode: EditorMode.INLINE,
        theme: EditorTheme.LIGHT,
        hideToolbar: false,
        activePanel: DrawerName.NAVIGATION,
        controlsPosition: ControlPosition.TOP,
        contentLoaded: false,
        activeObjIsText: false,
        activeObjIsShape: false,
        activeObjId: null,
        zoom: 100,
    },
    children: [
        FilterState,
        ResizeState,
        CropState,
        TransformState,
        DrawState,
        TextState,
        ShapesState,
        StickersState,
        FrameState,
        CornersState,
        BackgroundState,
        ObjectsState
    ],
})
export class EditorState implements NgxsOnInit {
    @Selector()
    static visible(state: EditorStateModel) {
        return state.visible;
    }

    @Selector()
    static mode(state: EditorStateModel) {
        return state.mode;
    }

    @Selector()
    static theme(state: EditorStateModel) {
        return state.theme;
    }

    @Selector()
    static controlsPosition(state: EditorStateModel) {
        return state.controlsPosition;
    }

    @Selector()
    static toolbarHidden(state: EditorStateModel) {
        return state.hideToolbar;
    }

    @Selector()
    static activePanel(state: EditorStateModel) {
        return state.activePanel;
    }

    @Selector()
    static contentLoaded(state: EditorStateModel) {
        return state.contentLoaded;
    }

    @Selector()
    static dirty(state: EditorStateModel) {
        const subState = state[state.activePanel];
        return subState.dirty;
    }

    @Selector()
    static zoom(state: EditorStateModel) {
        return state.zoom;
    }

    @Selector()
    static activeObjIsText(state: EditorStateModel) {
        return state.activeObjIsText;
    }

    @Selector()
    static activeObjIsShape(state: EditorStateModel) {
        return state.activeObjIsShape;
    }

    @Selector()
    static activeObjId(state: EditorStateModel) {
        return state.activeObjId;
    }

    constructor(
        private config: Settings,
        private breakpoints: BreakpointsService,
        private activeObject: ActiveObjectService,
    ) {}

    ngxsOnInit(ctx: StateContext<EditorStateModel>) {
        this.listenToConfigChange(ctx);
        this.listenToBreakpointChange(ctx);
    }

    @Action(OpenEditor)
    openEditor(ctx: StateContext<EditorStateModel>) {
        ctx.patchState({visible: true});
        this.executeCallback('onOpen');
    }

    @Action(CloseEditor)
    closeEditor(ctx: StateContext<EditorStateModel>, {executeCallback}: CloseEditor) {
        let shouldClose = this.config.get('pixie.ui.allowEditorClose');
        if (executeCallback) {
            shouldClose = this.executeCallback('onClose') !== false;
        }
        if (shouldClose) {
            ctx.patchState({visible: false});
        }
    }

    @Action(OpenPanel)
    openPanel(ctx: StateContext<EditorStateModel>, action: OpenPanel) {
        ctx.patchState({
            activePanel: action.panel,
        });
    }

    @Action(CloseForePanel)
    closeForePanel(ctx: StateContext<EditorStateModel>) {
        // navigation panel should always stay open
        ctx.patchState({activePanel: DrawerName.NAVIGATION});
    }

    @Action(ObjectSelected)
    objectSelected(ctx: StateContext<EditorStateModel>, action: ObjectSelected) {
        const state = this.getActiveObjState();

        // only open settings panel if selection event originated from
        // user clicking or tapping object on the canvas and not from
        // selecting object programmatically in the app
        if (action.fromUserAction && ctx.getState().activePanel === DrawerName.NAVIGATION) {
            state.activePanel = DrawerName.OBJECT_SETTINGS;
        }

        ctx.patchState(state);

        // sync active object form, when new object is selected
        this.activeObject.syncForm();
    }

    @Action(ObjectDeselected)
    objectDeselected(ctx: StateContext<EditorStateModel>) {
        const state = this.getActiveObjState();

        if (ctx.getState().activePanel === DrawerName.OBJECT_SETTINGS && !ctx.getState().objectSettings.dirty) {
            state.activePanel = DrawerName.NAVIGATION;
        }

        ctx.patchState(state);

        // sync active object form, when object is deselected
        this.activeObject.syncForm();
    }

    @Action(ContentLoaded)
    contentLoaded(ctx: StateContext<EditorStateModel>) {
        ctx.patchState({contentLoaded: true});
    }

    @Action(SetZoom)
    setZoom(ctx: StateContext<EditorStateModel>, {zoom}: SetZoom) {
        ctx.patchState({zoom});
    }

    private executeCallback(name: 'onClose'|'onOpen') {
        const callback = this.config.get('pixie.' + name) as Function;
        return callback && callback();
    }

    private listenToBreakpointChange(ctx: StateContext<EditorStateModel>) {
        this.breakpoints.isMobile$.subscribe(isMobile => {
            const position = this.config.get('pixie.ui.nav.position', ControlPosition.TOP);
            ctx.patchState({
                controlsPosition: isMobile ? ControlPosition.BOTTOM : position
            });
        });
    }

    private listenToConfigChange(ctx: StateContext<EditorStateModel>) {
        // TODO: refactor after settings are stored in state
        this.config.onChange.subscribe(() => {
            const config = this.config.get('pixie') as PixieConfig;
            ctx.patchState({
                mode: config.ui.mode,
                theme: config.ui.theme,
                hideToolbar: config.ui.toolbar.hide,
                visible: config.ui.visible,
            });
        });
    }

    private getActiveObjState() {
        const obj = this.activeObject.get();

        const state = {
            activeObjId: null,
            activeObjIsText: false,
            activeObjIsShape: false,
        } as EditorStateModel;

        if (obj) {
            state.activeObjId = obj.data.id;
            state.activeObjIsText = obj.type === 'i-text';
            state.activeObjIsShape = obj.name === ObjectNames.shape.name;
        }

        return state;
    }
}
