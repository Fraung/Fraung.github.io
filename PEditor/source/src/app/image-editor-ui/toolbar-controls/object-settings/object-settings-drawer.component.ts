import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActiveObjectService} from '../../../image-editor/canvas/active-object/active-object.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {MarkAsDirty, OpenObjectSettingsPanel} from '../../state/objects/objects.actions';
import {ObjectsState} from '../../state/objects/objects.state';
import {take} from 'rxjs/operators';
import {EditorState} from '../../../image-editor/state/editor-state';

@Component({
    selector: 'object-settings-drawer',
    templateUrl: './object-settings-drawer.component.html',
    styleUrls: ['./object-settings-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'controls-drawer'},
})
export class ObjectSettingsDrawerComponent implements OnInit, OnDestroy {
    @Select(ObjectsState.activePanel) activePanel$: Observable<string>;
    @Select(EditorState.activeObjIsText) activeObjIsText$: Observable<boolean>;
    @Select(EditorState.activeObjIsShape) activeObjIsShape$: Observable<boolean>;
    private subscription: Subscription;

    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        private store: Store,
    ) {}

    ngOnInit() {
        this.subscription = this.activeObject.propsChanged$
            .pipe(take(1))
            .subscribe(() => {
                this.store.dispatch(new MarkAsDirty());
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public openPanel(name: string) {
        this.store.dispatch(new OpenObjectSettingsPanel(name));
    }
}
