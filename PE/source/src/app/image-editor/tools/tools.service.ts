import {Injectable} from '@angular/core';
import {FilterToolService} from './filter/filter-tool.service';
import {ResizeToolService} from './resize/resize-tool.service';
import {TransformToolService} from './transform/transform-tool.service';
import {CropToolService} from './crop/crop-tool.service';
import {DrawToolService} from './draw/draw-tool.service';
import {TextToolService} from './text/text-tool.service';
import {ShapesToolService} from './shapes/shapes-tool.service';
import {FrameToolService} from './frame/frame-tool.service';
import {RoundToolService} from './round/round-tool.service';
import {ExportToolService} from './export/export-tool.service';
import {CanvasService} from '../canvas/canvas.service';
import {WatermarkToolService} from './watermark-tool.service';
import {HistoryToolService} from '../history/history-tool.service';
import {ActiveObjectService} from '../canvas/active-object/active-object.service';
import {ObjectsService} from '../objects/objects.service';
import {EditorControlsService} from '../../image-editor-ui/toolbar-controls/editor-controls.service';
import {CropZoneService} from './crop/crop-zone.service';
import {MergeToolService} from './merge/merge-tool.service';
import {ImportToolService} from './import/import-tool.service';
import {GoogleFontsPanelService} from '../../image-editor-ui/toolbar-controls/widgets/google-fonts-panel/google-fonts-panel.service';
import {FillToolService} from './fill/fill-tool.service';

@Injectable()
export class ToolsService {
    constructor(
        private filterTool: FilterToolService,
        private resizeTool: ResizeToolService,
        private cropTool: CropToolService,
        private transformTool: TransformToolService,
        private drawTool: DrawToolService,
        private textTool: TextToolService,
        private shapesTool: ShapesToolService,
        private frameTool: FrameToolService,
        private cornerTool: RoundToolService,
        private exportTool: ExportToolService,
        private importTool: ImportToolService,
        private canvas: CanvasService,
        private watermark: WatermarkToolService,
        private history: HistoryToolService,
        private activeObject: ActiveObjectService,
        private objects: ObjectsService,
        private controls: EditorControlsService,
        private cropZone: CropZoneService,
        private mergeTool: MergeToolService,
        private fillTool: FillToolService,
        private fonts: GoogleFontsPanelService,
    ) {}

    public get(name: string): any {
        if (name === 'canvas') {
            return this.canvas;
        } else {
            return this[name] || this[name + 'Tool'];
        }
    }
}
