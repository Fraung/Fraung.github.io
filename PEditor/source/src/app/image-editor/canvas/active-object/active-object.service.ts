import {Injectable} from '@angular/core';
import {Group, IObjectOptions, IText, ITextOptions, Object} from 'fabric/fabric-impl';
import {CanvasStateService} from '../canvas-state.service';
import {Subject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {ActiveObjectForm} from './active-object.form';
import {getFabricObjectProps} from '../../utils/get-fabric-object-props';
import {Settings} from '../../../../common/core/config/settings.service';
import {normalizeObjectProps} from '../../utils/normalize-object-props';
import {randomString} from '../../../../common/core/utils/random-string';
import {ObjectNames} from '../../objects/object-names.enum';

@Injectable()
export class ActiveObjectService {
    public propsChanged$ = new Subject();
    public form = ActiveObjectForm.build(this.fb);

    constructor(
        private fb: FormBuilder,
        private config: Settings,
        private canvasState: CanvasStateService,
    ) {}

    public init() {
        // set default values before subscribing to changes
        this.syncForm();

        this.form.valueChanges
            .subscribe(values => {
                this.setValues(values);
            });
    }

    /**
     * Check if active object (like i-text) is currently being edited by user.
     */
    public isEditing() {
        const text = this.get() as IText;
        return text && text.isEditing;
    }

    public setValues(values: ITextOptions) {
        const obj = this.get();
        if ( ! obj) return;

        // apply fill color to each svg line separately, so sticker
        // is not recolored when other values like shadow change
        if (obj.name === ObjectNames.sticker.name && values.fill !== obj.fill) {
            if ((obj as Group).forEachObject) {
                (obj as Group).forEachObject(path => path.set('fill', values.fill));
            }
        }

        this.propsChanged$.next();
        obj.set(normalizeObjectProps(values));
        this.canvasState.fabric.requestRenderAll();
    }

    public getValue(name: keyof IObjectOptions) {
        return this.get().get(name);
    }

    public get() {
        const obj = this.canvasState.fabric && this.canvasState.fabric.getActiveObject();
        if ( ! obj || ! obj.name) return null;
        if (obj.name.indexOf('crop.') > -1 || obj.name.indexOf('round.') > -1) return null;
        return obj;
    }

    public set(key: string|object, value?: any) {
        const obj = this.get();

        if (obj) {
            obj.set(key as any, value);
            this.canvasState.fabric.requestRenderAll();
        }
    }

    public move(direction: 'top'|'right'|'bottom'|'left', amount: number) {
        const obj = this.get();
        if ( ! obj) return;
        obj.set(direction as any, obj[direction] + amount);
        this.canvasState.fabric.requestRenderAll();
    }

    public bringToFront() {
        const obj = this.get(); if ( ! obj) return;
        obj.bringToFront();
        this.canvasState.fabric.requestRenderAll();
    }

    public sendToBack() {
        const obj = this.get(); if ( ! obj) return;
        obj.sendToBack();
        this.canvasState.fabric.requestRenderAll();
    }

    public flipHorizontal() {
        const obj = this.get();
        if ( ! obj) return;
        obj.flipX = !obj.flipX;
        this.canvasState.fabric.requestRenderAll();
    }

    public duplicate() {
        const original = this.get();
        if ( ! original) return;

        this.deselect();

        original.clone(clonedObj => {
            clonedObj.set({
                left: original.left + 10,
                top: original.top + 10,
                data: {...original.data, id: randomString(10)},
                name: original.name,
            });

            this.canvasState.fabric.add(clonedObj);
            this.select(clonedObj);
            this.canvasState.fabric.requestRenderAll();
        });
    }

    public getId() {
        const obj = this.get();
        return obj && obj.data ? obj.data.id : null;
    }

    /**
     * Delete currently active fabric object.
     */
    public delete() {
        const obj = this.get();
        if ( ! obj) return;
        this.canvasState.fabric.remove(obj);
        this.canvasState.fabric.requestRenderAll();
    }

    public deselect() {
        this.canvasState.fabric.discardActiveObject();
        this.canvasState.fabric.requestRenderAll();
    }

    public select(obj: Object) {
        this.canvasState.fabric.setActiveObject(obj);
    }

    public syncForm() {
        if (this.get()) {
            this.form.patchValue(getFabricObjectProps(this.get()), {emitEvent: false});
        } else {
            this.form.patchValue(this.config.get('pixie.objectDefaults'));
        }
    }
}
