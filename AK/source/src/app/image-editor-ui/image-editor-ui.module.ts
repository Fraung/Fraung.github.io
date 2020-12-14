import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageEditorComponent} from './image-editor.component';
import {HistoryPanelComponent} from './panels/history-panel/history-panel.component';
import {ObjectsPanelComponent} from './panels/objects-panel/objects-panel.component';
import {ImageEditorModule} from '../image-editor/image-editor.module';
import {ToolbarControlsModule} from './toolbar-controls/toolbar-controls.module';
import {EditorControlsService} from './toolbar-controls/editor-controls.service';
import {FloatingPanelsService} from './toolbar-controls/floating-panels.service';
import {
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatIconRegistry,
    MatRadioModule,
    MatSliderModule,
    MatTooltipModule
} from '@angular/material';
import {CustomScrollbarModule} from 'common/core/ui/custom-scrollbar/custom-scrollbar.module';
import {OverlayPanel} from 'common/core/ui/overlay-panel/overlay-panel.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {EditorOverlayContainer} from './panels/editor-overlay-container';
import { OpenSampleImagePanelComponent } from './panels/open-sample-image-panel/open-sample-image-panel.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BackgroundImageDirective} from './background-image.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {Settings} from '../../common/core/config/settings.service';
import {DomSanitizer} from '@angular/platform-browser';
import { ExportPanelComponent } from './panels/export-panel/export-panel.component';

export function init_icons(config: Settings, icons: MatIconRegistry, sanitizer: DomSanitizer) {
    return () => {
        const url = config.getAssetUrl('icons/merged.svg');
        icons.addSvgIconSet(
            sanitizer.bypassSecurityTrustResourceUrl(url)
        );
        return new Promise(resolve => resolve());
    };
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ImageEditorModule,
        ToolbarControlsModule,
        CustomScrollbarModule,

        // material
        MatSliderModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        DragDropModule,
        MatTooltipModule,
        MatDialogModule,
        MatRadioModule,
    ],
    declarations: [
        ImageEditorComponent,
        HistoryPanelComponent,
        ObjectsPanelComponent,
        OpenSampleImagePanelComponent,
        BackgroundImageDirective,
        ExportPanelComponent,
    ],
    entryComponents: [
        OpenSampleImagePanelComponent,
        HistoryPanelComponent,
        ObjectsPanelComponent,
        ExportPanelComponent,
    ],
    exports: [
        ImageEditorComponent,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: init_icons,
            deps: [Settings, MatIconRegistry, DomSanitizer],
            multi: true,
        },
        EditorControlsService,
        FloatingPanelsService,
        OverlayPanel,
        {provide: OverlayContainer, useClass: EditorOverlayContainer},
    ],
})
export class ImageEditorUIModule {}
