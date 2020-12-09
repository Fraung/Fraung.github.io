import {Injectable} from '@angular/core';
import {ActiveObjectService} from '../../canvas/active-object/active-object.service';
import {CanvasService} from '../../canvas/canvas.service';
import {ExportToolService} from '../export/export-tool.service';
import {ObjectsService} from '../../objects/objects.service';
import {ActiveFrameService} from '../frame/active-frame.service';
import {ObjectNames} from '../../objects/object-names.enum';

@Injectable()
export class MergeToolService {
    constructor(
        private activeObject: ActiveObjectService,
        private canvas: CanvasService,
        private saveTool: ExportToolService,
        private objects: ObjectsService,
        private activeFrame: ActiveFrameService,
    ) {}

    public canMerge(): boolean {
        return this.objects.getAll()
            .filter(obj => obj.name !== ObjectNames.mainImage.name)
            .length > 0;
    }

    public apply(): Promise<any> {
        const data = this.saveTool.getDataUrl();
        this.clearCanvas();
        return this.canvas.loadMainImage(data);
    }

    private clearCanvas() {
        this.activeFrame.remove();
        this.canvas.fabric().clear();
    }
}
