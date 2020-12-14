import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';

@Injectable()
export class ResizeToolService {

    constructor(private canvas: CanvasService) {}

    /**
     * Resize image and other canvas objects. If percentages is false, width/height should be pixels, otherwise it should be percentages.
     */
    public apply(width: number, height: number, percentages: boolean = false) {
        let currentWidth  = Math.ceil(this.canvas.state.original.width),
            currentHeight = Math.ceil(this.canvas.state.original.height),
            newWidth      = Math.ceil(width),
            newHeight     = Math.ceil(height),
            widthScale, heightScale;

        if (percentages) {
            widthScale    = width / 100;
            heightScale   = height / 100;
        } else {
            widthScale    = width / this.canvas.state.original.width;
            heightScale   = height / this.canvas.state.original.height;
        }

        if (currentWidth === newWidth && currentHeight === newHeight) return;

        this.resize(widthScale, heightScale);
    };

    /**
     * Resize canvas and all objects to specified scale.
     */
    private resize(widthScale: number, heightScale: number) {
        this.canvas.zoom.set(1, false);

        let newHeight = Math.round(this.canvas.state.original.height * heightScale),
            newWidth  = Math.round(this.canvas.state.original.width * widthScale);

        this.canvas.fabric().setHeight(newHeight);
        this.canvas.fabric().setWidth(newWidth);
        this.canvas.state.original.width = newWidth;
        this.canvas.state.original.height = newHeight;

        this.canvas.fabric().getObjects().forEach(object => {
            let scaleX = object.scaleX;
            let scaleY = object.scaleY;
            let left = object.left;
            let top = object.top;

            let tempScaleX = scaleX * widthScale;
            let tempScaleY = scaleY * heightScale;
            let tempLeft = left * widthScale;
            let tempTop = top * heightScale;

            object.scaleX = tempScaleX;
            object.scaleY = tempScaleY;
            object.left = tempLeft;
            object.top = tempTop;

            object.setCoords();
        });

        this.canvas.zoom.fitToScreen();
        this.canvas.render();
    }
}
