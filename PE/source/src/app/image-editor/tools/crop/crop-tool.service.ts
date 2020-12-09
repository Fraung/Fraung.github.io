import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {MergeToolService} from '../merge/merge-tool.service';
import {CropZoneService} from './crop-zone.service';

@Injectable()
export class CropToolService {
    constructor(
        private canvas: CanvasService,
        private mergeTool: MergeToolService,
        private cropZone: CropZoneService,
    ) {}

    /**
     * Crop canvas to specified dimensions.
     */
    public apply(box: {left: number, top: number, width: number, height: number}): Promise<any> {
        this.cropZone.remove();
        return this.mergeTool.apply().then(() => {
            this.canvas.resize(box.width, box.height);

            const img = this.canvas.getMainImage();
            img.cropX = box.left;
            img.cropY = box.top;
            img.width = box.width;
            img.height = box.height;

            this.canvas.render();
        });
    }
}
