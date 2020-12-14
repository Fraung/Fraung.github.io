import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ObjectsService} from '../../../image-editor/objects/objects.service';
import {OverlayPanelRef} from 'common/core/ui/overlay-panel/overlay-panel-ref';
import {Object} from 'fabric/fabric-impl';
import {EditorControlsService} from '../../toolbar-controls/editor-controls.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CanvasStateService} from '../../../image-editor/canvas/canvas-state.service';
import {Select, Store} from '@ngxs/store';
import {EditorState} from '../../../image-editor/state/editor-state';
import {OpenPanel} from '../../../image-editor/state/editor-state-actions';
import {DrawerName} from '../../toolbar-controls/drawers/drawer-name.enum';
import {ObjectNames} from '../../../image-editor/objects/object-names.enum';
import {Observable} from 'rxjs';

@Component({
    selector: 'objects-panel',
    templateUrl: './objects-panel.component.html',
    styleUrls: ['./objects-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ObjectsPanelComponent {
    @Select(EditorState.activeObjId) activeObjId$: Observable<string>;

    constructor(
        public objects: ObjectsService,
        public panelRef: OverlayPanelRef,
        private controls: EditorControlsService,
        private canvasState: CanvasStateService,
        private store: Store,
    ) {}

    public getIcon(object: Object): string {
        return ObjectNames[object.name].icon;
    }

    public selectObject(object: Object) {
        this.objects.select(object);
        if ( ! this.store.selectSnapshot(EditorState.dirty)) {
            this.store.dispatch(new OpenPanel(DrawerName.OBJECT_SETTINGS));
        }
    }

    public getObjectDisplayName(object: Object): string {
        const name = object.name;
        return name ? name.replace(/([A-Z])/g, ' $1') : '';
    }

    public reorderObjects(e: CdkDragDrop<string>) {
        moveItemInArray(this.objects.getAll(), e.previousIndex, e.currentIndex);

        // pixie and canvas object orders are reversed, need to
        // reverse newIndex given by cdk drag and drop
        const index = this.objects.getAll()
            .slice().reverse().findIndex(obj => obj.data.id === e.item.data);

        this.objects.getById(e.item.data).moveTo(index);
        this.canvasState.fabric.requestRenderAll();
    }

    public shouldDisableObject(object: Object): boolean {
        return !object.selectable && object.name !== ObjectNames.drawing.name;
    }
}
