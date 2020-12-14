import {Frame} from '../tools/frame/frame';
import {FontItem} from '../../image-editor-ui/toolbar-controls/widgets/google-fonts-panel/font-item';

export interface SerializedCanvas {
    canvas: object|string;
    editor: {
        frame: Frame|null,
        fonts: FontItem[]
    };
    canvasWidth: number;
    canvasHeight: number;
}
