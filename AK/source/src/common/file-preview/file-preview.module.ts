import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextPreviewComponent } from './text-preview/text-preview.component';
import { AVAILABLE_PREVIEWS, DefaultPreviews } from './available-previews';
import { PreviewContainerComponent } from './preview-container/preview-container.component';
import { PortalModule } from '@angular/cdk/portal';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { PdfPreviewComponent } from './pdf-preview/pdf-preview.component';
import { DefaultPreviewComponent } from './default-preview/default-preview.component';
import { MatButtonModule } from '@angular/material';
import { AudioPreviewComponent } from './audio-preview/audio-preview.component';

@NgModule({
    imports: [
        CommonModule,

        // material
        PortalModule,
        MatButtonModule,
    ],
    exports: [
        PreviewContainerComponent,
    ],
    declarations: [
        PreviewContainerComponent,
        TextPreviewComponent,
        VideoPreviewComponent,
        ImagePreviewComponent,
        PdfPreviewComponent,
        DefaultPreviewComponent,
        AudioPreviewComponent
    ],
    entryComponents: [
        TextPreviewComponent,
        VideoPreviewComponent,
        ImagePreviewComponent,
        PdfPreviewComponent,
        DefaultPreviewComponent,
        AudioPreviewComponent,
    ],
    providers: [
        {provide: AVAILABLE_PREVIEWS, useClass: DefaultPreviews},
    ]
})
export class FilePreviewModule {
}
