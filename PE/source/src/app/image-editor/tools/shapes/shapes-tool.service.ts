import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {CanvasService} from '../../canvas/canvas.service';
import {BasicShape} from './default-shapes';
import {StickerCategory} from './default-stickers';
import {Settings} from 'common/core/config/settings.service';
import {Object as FObject} from 'fabric/fabric-impl';
import {ObjectNames} from '../../objects/object-names.enum';

@Injectable()
export class ShapesToolService {
    private addStickerResolve;

    constructor(
        private canvas: CanvasService,
        private config: Settings
    ) {}

    /**
     * Get shape matching specified name.
     */
    public getShapeByName(name: string): BasicShape|null {
        return this.config.get('pixie.tools.shapes.items').find(shape => {
            return shape.name === name;
        });
    }

    /**
     * Add a basic shape to canvas by specified name or shape.
     */
    public addBasicShape(shape: string|BasicShape) {
        if (typeof shape === 'string') {
            shape = this.getShapeByName(shape);
        }

        const basicShape = shape as BasicShape;

        const canvasWidth = this.canvas.fabric().getWidth(),
            options = basicShape.options || {} as any,
            size = canvasWidth / 2;

        if (basicShape.name === 'circle') {
            options.radius = size;
        } else if (basicShape.name === 'ellipse') {
            options.rx = size;
            options.ry = size / 2;
        } else {
            options.width = size;
            options.height = size;
        }

        let fabricShape: FObject;

        if (basicShape.type === 'Path') {
            fabricShape = new fabric[basicShape.type](options.path, options);
        } else {
            fabricShape = new fabric[basicShape.type](options);
        }

        this.addAndPositionSticker(fabricShape);
    }

    /**
     * Add specified sticker to canvas.
     */
    public addSticker(category: StickerCategory, name: number|string): Promise<any> {
        return new Promise(resolve => {
            this.addStickerResolve = resolve;

            if (category.type === 'svg') {
                this.addSvgSticker(category, name);
            } else {
                this.addRegularSticker(category, name);
            }
        });
    }

    private addRegularSticker(category: StickerCategory, name: number|string) {
        fabric.util.loadImage(this.getStickerUrl(category, name), img => {
            const sticker = new fabric.Image(img);
            this.addAndPositionSticker(sticker, ObjectNames.sticker);
        });
    }

    private addAndPositionSticker(sticker: FObject, objectName: {name: string} = ObjectNames.shape) {
        sticker.name = objectName.name;
        this.canvas.fabric().add(sticker);
        this.canvas.fabric().setActiveObject(sticker);
        sticker.scaleToWidth(this.canvas.fabric().getWidth() / 4);
        sticker.viewportCenter();
        sticker.setCoords();
        this.canvas.render();
        this.addStickerResolve && this.addStickerResolve();
    }

    public getStickerUrl(category: StickerCategory, stickerName: number|string): string {
        return this.config.getAssetUrl(
            'images/stickers/' + category.name + '/' + stickerName + '.' + category.type
        );
    }

    public getStickerCategoryUrl(category: StickerCategory) {
        if (category.thumbnailUrl) return this.config.getAssetUrl(category.thumbnailUrl);
        return this.getStickerUrl(category, 1);

    }

    private addSvgSticker(category: StickerCategory, name: number|string) {
        fabric.loadSVGFromURL(this.getStickerUrl(category, name), (objects, options) => {
            const sticker = fabric.util.groupSVGElements(objects, options);
            this.addAndPositionSticker(sticker, ObjectNames.sticker);
        });
    }
}
