import {Injectable} from '@angular/core';
import {HistoryItem} from './history-item.interface';
import {Image} from 'fabric/fabric-impl';
import {CanvasService} from '../canvas/canvas.service';
import {ActiveObjectService} from '../canvas/active-object/active-object.service';
import {ObjectsService} from '../objects/objects.service';
import {FrameToolService} from '../tools/frame/frame-tool.service';
import {SerializedCanvas} from './serialized-canvas';
import {TextToolService} from '../tools/text/text-tool.service';
import {GoogleFontsPanelService} from '../../image-editor-ui/toolbar-controls/widgets/google-fonts-panel/google-fonts-panel.service';
import {Actions, ofActionSuccessful, Store} from '@ngxs/store';
import {HistoryState} from '../../image-editor-ui/state/history/history.state';
import {
    AddHistoryItem,
    HistoryChanged,
    ReplaceCurrentItem,
    ResetHistory,
    UpdatePointerById
} from '../../image-editor-ui/state/history/history.actions';
import {randomString} from '../../../common/core/utils/random-string';
import {HistoryNames} from './history-names.enum';
import {staticObjectConfig} from '../objects/static-object-config';
import {ContentLoaded} from '../state/editor-state-actions';
import {take} from 'rxjs/operators';

@Injectable()
export class HistoryToolService {
    constructor(
        public canvas: CanvasService,
        private activeObject: ActiveObjectService,
        private objects: ObjectsService,
        private frameTool: FrameToolService,
        private googleFonts: GoogleFontsPanelService,
        private textTool: TextToolService,
        private store: Store,
        private actions$: Actions,
    ) {
        this.actions$.pipe(ofActionSuccessful(ContentLoaded), take(1))
            .subscribe(() => {
                this.addInitial();
            });
    }

    public undo() {
        if (!this.store.selectSnapshot(HistoryState.canUndo)) return;
        return this.load(this.store.selectSnapshot(HistoryState.item('previous')));
    }

    public redo() {
        if (!this.store.selectSnapshot(HistoryState.canRedo)) return;
        return this.load(this.store.selectSnapshot(HistoryState.item('next')));
    }

    /**
     * Reload current history state, getting rid of
     * any canvas changes that were not yet applied.
     */
    public reload() {
        return this.load(this.store.selectSnapshot(HistoryState.item('current')));
    }

    /**
     * Replace current history item with current canvas state.
     */
    public replaceCurrent() {
        const current = this.store.selectSnapshot(HistoryState.item('current'));
        this.store.dispatch(new ReplaceCurrentItem(this.createHistoryItem(current.name, current.icon)));
    }

    public add(params: {name: string, icon: string}, json?: SerializedCanvas) {
        this.store.dispatch(new AddHistoryItem(this.createHistoryItem(params.name, params.icon, json)));
    }

    public addFromJson(json: string|SerializedCanvas) {
        const initial = !this.store.selectSnapshot(HistoryState.items).length,
            name = initial ? HistoryNames.INITIAL : HistoryNames.LOADED_STATE;
        this.add(name, typeof json === 'string' ? JSON.parse(json) : json);
        return this.reload();
    }

    public getCurrentCanvasState(): SerializedCanvas {
        return {
            canvas: this.canvas.fabric().toJSON([...Object.keys(staticObjectConfig), 'crossOrigin', 'name', 'data']),
            editor: {frame: this.frameTool.getActive(), fonts: this.textTool.getUsedFonts()},
            canvasWidth: this.canvas.state.original.width,
            canvasHeight: this.canvas.state.original.height,
        };
    }

    public clear() {
        this.store.dispatch(new ResetHistory());
    }

    public addInitial() {
        const historyEmpty = !this.store.selectSnapshot(HistoryState.items).length;
        if (historyEmpty) {
            this.add(HistoryNames.INITIAL);
        }
    }

    public load(item: HistoryItem): Promise<any> {
       return new Promise(resolve => {
           this.store.dispatch(new UpdatePointerById(item.id));

           this.googleFonts.loadIntoDom(item.editor.fonts).then(() => {
               this.canvas.fabric().loadFromJSON(item.canvas, () => {
                   this.canvas.zoom.set(1);

                   // resize canvas if needed
                   if (item.canvasWidth && item.canvasHeight) {
                       this.canvas.resize(item.canvasWidth, item.canvasHeight);
                   }

                   // init or remove canvas frame
                   if (item.editor.frame) {
                       this.frameTool.add(item.editor.frame.name);
                   } else {
                       this.frameTool.remove();
                   }

                   // prepare fabric.js and canvas
                   this.canvas.render();
                   this.canvas.fabric().calcOffset();
                   this.canvas.state.loading = false;
                   this.canvas.zoom.fitToScreen();

                   this.objects.syncObjects();
                   this.store.dispatch(new HistoryChanged());
                   resolve();
               }, obj => {
                   // reapply any filters object used to have
                   if (obj.hasOwnProperty('applyFilters')) {
                       (obj as Image).applyFilters();
                   }
               });
           });
       });
    }

    private createHistoryItem(name: string, icon: string|null = null, state?: SerializedCanvas): HistoryItem {
        if ( ! state) state = this.getCurrentCanvasState();

        return Object.assign(state, {
            name: name,
            id: randomString(15),
            icon: icon,
            zoom: this.canvas.zoom.get(),
            activeObjectId: this.activeObject.getId(),
        });
    }
}
