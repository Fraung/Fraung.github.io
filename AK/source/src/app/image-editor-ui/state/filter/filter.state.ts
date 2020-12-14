import {Action, Actions, NgxsOnInit, Selector, State, StateContext, Store} from '@ngxs/store';
import {OpenFilterControls, RemoveFilter, ApplyFilter, SetAppliedFilters} from './filter.actions';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {CloseForePanel} from '../../../image-editor/state/editor-state-actions';
import {HistoryNames} from '../../../image-editor/history/history-names.enum';
import {BaseToolState} from '../base-tool.state';
import {DrawerName} from '../../toolbar-controls/drawers/drawer-name.enum';

interface FilterStateModel {
    dirty: boolean;
    activeFilters: string[];
    selectedFilter: string;
}

@State<FilterStateModel>({
    name: 'filter',
    defaults: {
        dirty: false,
        activeFilters: [],
        selectedFilter: null,
    }
})
export class FilterState extends BaseToolState<FilterStateModel> implements NgxsOnInit {
    protected toolName = DrawerName.FILTER;

    @Selector()
    static activeFilters(state: FilterStateModel) {
        return state.activeFilters;
    }

    @Selector()
    static selectedFilter(state: FilterStateModel) {
        return state.selectedFilter;
    }

    @Selector()
    static dirty(state: FilterStateModel) {
        return state.dirty;
    }

    constructor(
        protected store: Store,
        protected history: HistoryToolService,
        protected actions$: Actions,
    ) {
        super();
    }

    @Action(ApplyFilter)
    toggleFilter(ctx: StateContext<FilterStateModel>, action: ApplyFilter) {
        ctx.patchState({
            dirty: true,
            activeFilters: [...ctx.getState().activeFilters, action.filter]
        });
    }

    @Action(RemoveFilter)
    removeFilter(ctx: StateContext<FilterStateModel>, action: RemoveFilter) {
        const activeFilters = ctx.getState().activeFilters.filter(f => f !== action.filter);
        ctx.patchState({dirty: true, activeFilters});
    }

    @Action(OpenFilterControls)
    openFilterControls(ctx: StateContext<FilterStateModel>, action: OpenFilterControls) {
        ctx.patchState({selectedFilter: action.filter});
    }

    @Action(SetAppliedFilters)
    setAppliedFilters(ctx: StateContext<FilterStateModel>, {filters}: SetAppliedFilters) {
        ctx.patchState({activeFilters: filters});
    }

    applyChanges(ctx: StateContext<FilterStateModel>) {
        this.store.dispatch(new CloseForePanel());
        if (ctx.getState().dirty) {
            this.history.add(HistoryNames.FILTER);
        }
        ctx.patchState({dirty: false, selectedFilter: null});
    }

    cancelChanges(ctx: StateContext<FilterStateModel>) {
        if ( ! ctx.getState().selectedFilter) {
            this.store.dispatch(new CloseForePanel());
        }

        if (ctx.getState().dirty) {
           this.history.reload();
        }

        ctx.patchState({dirty: false, selectedFilter: null});
    }
}
