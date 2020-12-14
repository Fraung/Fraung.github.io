import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {EditorControlsService} from './editor-controls.service';
import {Settings} from 'common/core/config/settings.service';
import {ActiveObjectService} from '../../image-editor/canvas/active-object/active-object.service';
import {Select, Store} from '@ngxs/store';
import {EditorState} from '../../image-editor/state/editor-state';
import {Observable} from 'rxjs';
import {ApplyChanges, CancelChanges} from '../../image-editor/state/editor-state-actions';
import {ControlPosition} from '../../image-editor/enums/control-positions.enum';
import {BreakpointsService} from '../../../common/core/ui/breakpoints.service';

@Component({
    selector: 'editor-controls',
    templateUrl: './editor-controls.component.html',
    styleUrls: ['./editor-controls.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('controlsAnimation', [
            transition(':enter', [
                style({ opacity: 0}),
                animate('225ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('0ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0 }))
            ])
        ]),
    ]
})
export class EditorControlsComponent {
    @Select(EditorState.activePanel) activePanel$: Observable<string>;
    @Select(EditorState.controlsPosition) controlsPosition$: Observable<ControlPosition>;
    @Select(EditorState.activeObjId) activeObjId$: Observable<string>;
    @Select(EditorState.dirty) dirty$: Observable<boolean>;

    constructor(
        public controls: EditorControlsService,
        private settings: Settings,
        public activeObject: ActiveObjectService,
        private store: Store,
        public breakpoints: BreakpointsService,
    ) {}

    public applyChanges() {
        const panel = this.store.selectSnapshot(EditorState.activePanel);
        this.store.dispatch(new ApplyChanges(panel));
    }

    public cancelChanges() {
        const panel = this.store.selectSnapshot(EditorState.activePanel);
        this.store.dispatch(new CancelChanges(panel));
    }
}
