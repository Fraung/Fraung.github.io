import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ColorPickerModule} from 'common/core/ui/color-picker/color-picker.module';
import {GoogleFontsModule} from './widgets/google-fonts-panel/google-fonts.module';
import {CustomScrollbarModule} from 'common/core/ui/custom-scrollbar/custom-scrollbar.module';
import {HttpModule} from 'common/core/http/http.module';
import {EditorControlsComponent} from './editor-controls.component';
import {FilterDrawerComponent} from './drawers/filter-drawer/filter-drawer.component';
import {ResizeDrawerComponent} from './drawers/resize-drawer/resize-drawer.component';
import {CropDrawerComponent} from './drawers/crop-drawer/crop-drawer.component';
import {TransformDrawerComponent} from './drawers/transform-drawer/transform-drawer.component';
import {DrawDrawerComponent} from './drawers/draw-drawer/draw-drawer.component';
import {TextDrawerComponent} from './drawers/text-drawer/text-drawer.component';
import {ColorWidgetComponent} from './widgets/color-widget/color-widget.component';
import {ShapesDrawerComponent} from './drawers/shapes-drawer/shapes-drawer.component';
import {TextControlsDrawerComponent} from './drawers/text-controls-drawer/text-controls-drawer.component';
import {ObjectSettingsDrawerComponent} from './object-settings/object-settings-drawer.component';
import {StickersDrawerComponent} from './drawers/stickers-drawer/stickers-drawer.component';
import {ShadowControlsDrawer} from './shadow-controls-drawer/shadow-controls-drawer.component';
import {NavigationBarComponent} from './navigation-bar/navigation-bar.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ColorControlsDrawerComponent} from './color-controls-drawer/color-controls-drawer.component';
import {TextureControlsDrawerComponent} from './drawers/texture-controls-drawer/texture-controls-drawer.component';
import {OutlineControlsDrawerComponent} from './outline-controls-drawer/outline-controls-drawer.component';
import {GradientControlsDrawerComponent} from './drawers/gradient-controls-drawer/gradient-controls-drawer.component';
import {FilterControlsComponent} from './drawers/filter-controls/filter-controls.component';
import {RoundDrawerComponent} from './drawers/round-drawer/round-drawer.component';
import {FrameDrawerComponent} from './drawers/frame-drawer/frame-drawer.component';
import {Toast} from 'common/core/ui/toast.service';
import {
    MatButtonModule, MatButtonToggleModule,
    MatCheckboxModule,
    MatIconModule, MatMenuModule, MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule, MatTooltipModule
} from '@angular/material';
import {CanvasBackgroundDrawerComponent} from './drawers/canvas-background-drawer/canvas-background-drawer.component';
import {FloatingObjectControlsComponent} from '../floating-object-controls/floating-object-controls.component';
import {ImageEditorModule} from '../../image-editor/image-editor.module';
import {OpacityControlsDrawer} from './drawers/opacity-controls-drawer/opacity-controls-drawer.component';
import { TextFontSelectorComponent } from './widgets/text-font-selector/text-font-selector.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ColorPickerModule,
        GoogleFontsModule,
        CustomScrollbarModule,
        HttpModule,
        ImageEditorModule,

        // material
        MatSliderModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatRadioModule,
        MatMenuModule,
        MatButtonToggleModule,
        MatTooltipModule,
    ],
    declarations: [
        EditorControlsComponent,
        FilterDrawerComponent,
        ResizeDrawerComponent,
        TransformDrawerComponent,
        CropDrawerComponent,
        DrawDrawerComponent,
        TextDrawerComponent,
        ColorWidgetComponent,
        TextControlsDrawerComponent,
        ShapesDrawerComponent,
        StickersDrawerComponent,
        ObjectSettingsDrawerComponent,
        ShadowControlsDrawer,
        OpacityControlsDrawer,
        NavigationBarComponent,
        ToolbarComponent,
        ColorControlsDrawerComponent,
        OutlineControlsDrawerComponent,
        TextureControlsDrawerComponent,
        GradientControlsDrawerComponent,
        FilterControlsComponent,
        RoundDrawerComponent,
        FrameDrawerComponent,
        CanvasBackgroundDrawerComponent,
        FloatingObjectControlsComponent,
        TextFontSelectorComponent,
    ],
    exports: [
        EditorControlsComponent,
        FilterDrawerComponent,
        ResizeDrawerComponent,
        TransformDrawerComponent,
        CropDrawerComponent,
        DrawDrawerComponent,
        TextDrawerComponent,
        ColorWidgetComponent,
        TextControlsDrawerComponent,
        ShapesDrawerComponent,
        StickersDrawerComponent,
        ObjectSettingsDrawerComponent,
        ShadowControlsDrawer,
        NavigationBarComponent,
        ToolbarComponent,
        ColorControlsDrawerComponent,
        OutlineControlsDrawerComponent,
        TextureControlsDrawerComponent,
        GradientControlsDrawerComponent,
        FilterControlsComponent,
        RoundDrawerComponent,
        FrameDrawerComponent,
        CanvasBackgroundDrawerComponent,
        FloatingObjectControlsComponent,
    ],
    providers: [
        Toast,
    ],
})
export class ToolbarControlsModule {
}
