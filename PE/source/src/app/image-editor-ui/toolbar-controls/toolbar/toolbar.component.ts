import {AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {Settings} from 'common/core/config/settings.service';
import {FloatingPanelsService} from '../floating-panels.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {CanvasZoomService} from '../../../image-editor/canvas/canvas-zoom.service';
import {ExportToolService} from '../../../image-editor/tools/export/export-tool.service';
import {CanvasService} from '../../../image-editor/canvas/canvas.service';
import {delay} from 'rxjs/operators';
import {MatMenuTrigger} from '@angular/material';
import {BreakpointsService} from '../../../../common/core/ui/breakpoints.service';
import {ImportToolService} from '../../../image-editor/tools/import/import-tool.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {EditorState} from '../../../image-editor/state/editor-state';
import {ApplyChanges, CancelChanges, CloseEditor, CloseForePanel} from '../../../image-editor/state/editor-state-actions';
import {HistoryNames} from '../../../image-editor/history/history-names.enum';
import {HistoryState} from '../../state/history/history.state';
import {EditorMode} from '../../../image-editor/enums/editor-mode.enum';
import {startCase} from '../../../../common/core/utils/start-case';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements AfterViewInit {
    @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
    @Select(EditorState.mode) mode$: Observable<EditorMode>;
    @Select(EditorState.zoom) zoom$: Observable<number>;
    @Select(EditorState.activePanel) activePanel$: Observable<string>;
    @Select(HistoryState.canUndo) canUndo$: Observable<boolean>;
    @Select(HistoryState.canRedo) canRedo$: Observable<boolean>;
    public compactMode = new BehaviorSubject(false);

    constructor(
        public history: HistoryToolService,
        public config: Settings,
        public zoom: CanvasZoomService,
        public panels: FloatingPanelsService,
        public breakpoints: BreakpointsService,
        private importTool: ImportToolService,
        private exportTool: ExportToolService,
        private canvas: CanvasService,
        private floatingPanels: FloatingPanelsService,
        private store: Store,
    ) {}

    ngAfterViewInit() {
        this.canvas.state.loaded.pipe(delay(0)).subscribe(() => {
            this.floatingPanels.openSampleImagePanel();
        });

        this.breakpoints.observe('(max-width: 768px)')
            .subscribe(result => this.compactMode.next(result.matches));
    }

    public zoomIn() {
        this.zoom.set(this.zoom.get() + 0.05);
    }

    public zoomOut() {
        this.zoom.set(this.zoom.get() - 0.05);
    }

    public exportImage() {
        if (this.config.get('pixie.ui.showExportPanel')) {
            this.panels.openExportPanel();
        } else {
            this.exportTool.export();
        }
    }

    /**
     * Ask user to upload a new background image and override current one.
     */
    public openBackgroundImage() {
        this.importTool.openUploadDialog({type: 'image', backgroundImage: true}).then(() => {
            this.history.add(HistoryNames.BG_IMAGE);
        });
    }

    /**
     * Ask user to upload a new overlay image and add it to canvas.
     */
    public openOverlayImage() {
        this.importTool.openUploadDialog().then(obj => {
            if ( ! obj) return;
            this.canvas.fabric().setActiveObject(obj);
            this.history.add(HistoryNames.OVERLAY_IMAGE);
        });
    }

    /**
     * Ask user to upload state file and override current editor state.
     */
    public openStateFile() {
        return this.importTool.openUploadDialog({type: 'state'});
    }

    /**
     * Execute custom open button action or open dropdown menu if no action provided.
     */
    public executeOpenButtonAction() {
        const action = this.config.get('pixie.ui.toolbar.openButtonAction');

        if ( ! action) {
            this.matMenuTrigger.toggleMenu();
        } else {
            action();
        }
    }

    public applyChanges() {
        const panel = this.store.selectSnapshot(EditorState.activePanel);
        this.store.dispatch(new ApplyChanges(panel));
    }

    public cancelChanges() {
        const panel = this.store.selectSnapshot(EditorState.activePanel);
        this.store.dispatch(new CancelChanges(panel));
    }

    public closeEditor() {
        this.store.dispatch(new CloseEditor());
    }

    public getToolDisplayName(name: string) {
        return startCase(name);
    }
}
