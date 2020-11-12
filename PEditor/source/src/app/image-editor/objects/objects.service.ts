import {Injectable} from '@angular/core';
import {Object} from 'fabric/fabric-impl';
import {CanvasService} from '../canvas/canvas.service';
import {ActiveObjectService} from '../canvas/active-object/active-object.service';
import {Store} from '@ngxs/store';
import {ObjectsSynced} from '../state/editor-state-actions';

@Injectable()
export class ObjectsService {
    private objects: Object[] = [];

    constructor(
        private canvas: CanvasService,
        private activeObject: ActiveObjectService,
        private store: Store,
    ) {
        this.init();
    }

    /**
     * Get all canvas objects.
     */
    public getAll() {
        return this.objects;
    }

    /**
     * Get object with specified name from canvas.
     */
    public get(name: string) {
        return this.objects.find(obj => obj.name === name);
    }

    /**
     * Get object with specified id from canvas.
     */
    public getById(id: string) {
        return this.objects.find(obj => obj.data.id === id);
    }

    public isActive(object: Object): boolean {
        return this.activeObject.getId() === object.data.id;
    }

    /**
     * Check if object with specified name exists on canvas.
     */
    public has(name: string) {
        return this.objects.findIndex(obj => obj.name === name) > -1;
    }

    /**
     * Select specified object.
     */
    public select(object: Object) {
        this.canvas.state.fabric.setActiveObject(object);
        this.canvas.state.fabric.requestRenderAll();
    }

    /**
     * Sync layers list with fabric.js objects.
     */
    public syncObjects() {
        this.objects = this.canvas.fabric().getObjects()
            .filter(object => {
                if ( ! object.name) return;

                return object.name.indexOf('crop.') === -1 &&
                    object.name.indexOf('round.') === -1 &&
                    object.name.indexOf('frame.') === -1;
            }).reverse();

        this.store.dispatch(new ObjectsSynced());
    }

    public init() {
        this.canvas.state.loaded.subscribe(() => {
            this.canvas.state.loaded.subscribe(() => {
                this.syncObjects();
            });

            this.canvas.fabric().on('object:added', () => {
                setTimeout(() => this.syncObjects());
            });

            this.canvas.fabric().on('object:removed', () => {
                this.syncObjects();
            });
        });
    }
}
