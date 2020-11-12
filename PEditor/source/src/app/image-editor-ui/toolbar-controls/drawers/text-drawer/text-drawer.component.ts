import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object/active-object.service';
import {Store} from '@ngxs/store';
import {AddText} from '../../../state/text/text.actions';

@Component({
    selector: 'text-drawer',
    templateUrl: './text-drawer.component.html',
    styleUrls: ['./text-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'controls-drawer'},
})
export class TextDrawerComponent {
    constructor(
        private store: Store,
        public activeObject: ActiveObjectService,
    ) {}

    public addText() {
        this.store.dispatch(new AddText());
    }
}
