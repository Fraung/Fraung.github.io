import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Settings} from 'common/core/config/settings.service';
import {OverlayPanelRef} from 'common/core/ui/overlay-panel/overlay-panel-ref';
import {FormControl, FormGroup} from '@angular/forms';
import {CanvasService} from '../../../image-editor/canvas/canvas.service';
import {ImportToolService} from '../../../image-editor/tools/import/import-tool.service';
import {BehaviorSubject} from 'rxjs';
import {SampleImage} from './sample-image';

@Component({
    selector: 'open-sample-image-panel',
    templateUrl: './open-sample-image-panel.component.html',
    styleUrls: ['./open-sample-image-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class OpenSampleImagePanelComponent {
    public newCanvasForm = new FormGroup({
        width: new FormControl(800),
        height: new FormControl(600),
    });

    public newCanvasFormVisible$ = new BehaviorSubject(false);
    public sampleImages: SampleImage[];

    constructor(
        public importTool: ImportToolService,
        private config: Settings,
        private panelRef: OverlayPanelRef,
        private canvas: CanvasService,
    ) {
        this.sampleImages = this.config.get('pixie.ui.openImageDialog.sampleImages');
    }

    public openUploadDialog() {
        this.importTool.openUploadDialog({backgroundImage: true}).then(() => this.close());
    }

    public openSampleImage(image: SampleImage) {
        this.importTool.openBackgroundImage(this.getImageUrl(image))
            .then(() => this.close());
    }

    public createNewCanvas() {
        const width = this.newCanvasForm.get('width').value,
            height = this.newCanvasForm.get('height').value;

        this.config.set('pixie.blankCanvasSize', {width, height});
        this.canvas.openNew(width, height).then(() => this.close());
    }

    public close() {
        this.panelRef.close();
    }

    public getImageUrl(image: SampleImage, useThumbnail = false) {
        const url = (image.thumbnail && useThumbnail) ? image.thumbnail : image.url;
        // prefix relative link with base url, if needed
        if (url.indexOf('//') === -1) {
            return this.config.getAssetUrl(url);
        } else {
            return url;
        }
    }
}
