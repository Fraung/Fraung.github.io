import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges, OnDestroy, ComponentRef } from '@angular/core';
import { FileEntry } from '../../uploads/file-entry';
import { PreviewFilesService } from '../preview-files.service';
import { BaseFilePreview } from '../base-file-preview';
import { Subscription } from 'rxjs';

@Component({
    selector: 'preview-container',
    templateUrl: './preview-container.component.html',
    styleUrls: ['./preview-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewContainerComponent implements OnChanges, OnDestroy {
    @Input() files: FileEntry[];
    private downloadSub: Subscription;

    constructor(public previewFiles: PreviewFilesService) {}

    ngOnChanges(changes) {
        this.previewFiles.set(this.files);
    }

    ngOnDestroy() {
        this.previewFiles.destroy();
        if (this.downloadSub) this.downloadSub.unsubscribe();
    }

    public test(comp: ComponentRef<BaseFilePreview>) {
        if (this.downloadSub) this.downloadSub.unsubscribe();
        this.downloadSub = comp.instance.download.subscribe(() => {
            this.previewFiles.download.next();
        });
    }
}
