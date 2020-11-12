import {Actions, NgxsOnInit, ofActionSuccessful, Selector, StateContext} from '@ngxs/store';
import {ApplyChanges, CancelChanges} from '../../image-editor/state/editor-state-actions';
import {filter} from 'rxjs/operators';
import {DrawerName} from '../toolbar-controls/drawers/drawer-name.enum';
import {HistoryChanged} from './history/history.actions';

export abstract class BaseToolState<T> implements NgxsOnInit {
    protected abstract actions$: Actions;
    protected abstract toolName: DrawerName;

    ngxsOnInit(ctx?: StateContext<T>) {
        this.actions$.pipe(
            ofActionSuccessful(ApplyChanges),
            filter(action => action.panel === this.toolName)
        ).subscribe(action => {
            this.applyChanges(ctx, action);
        });

        this.actions$.pipe(
            ofActionSuccessful(CancelChanges),
            filter(action => action.panel === this.toolName)
        ).subscribe(action => {
            this.cancelChanges(ctx, action);
        });
    }

    public abstract applyChanges(ctx: StateContext<T>, action: ApplyChanges);
    public abstract cancelChanges(ctx: StateContext<T>, action: CancelChanges);
}
