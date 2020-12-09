import {NgModule} from '@angular/core';
import {GoogleFontsPanelComponent} from './google-fonts-panel.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {GoogleFontsPanelService} from './google-fonts-panel.service';
import {FontsPaginatorService} from './fonts-paginator.service';
import {MatIconModule, MatPaginatorModule, MatTooltipModule} from '@angular/material';
import {TranslationsModule} from '../../../../../common/core/translations/translations.module';

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        TranslationsModule,

        // material
        MatIconModule,
        MatTooltipModule,
        MatPaginatorModule,
    ],
    entryComponents: [
        GoogleFontsPanelComponent,
    ],
    declarations: [
        GoogleFontsPanelComponent,
    ],
    providers: [
        GoogleFontsPanelService,
        FontsPaginatorService,
    ],
    exports: [
        GoogleFontsPanelComponent,
    ],
})
export class GoogleFontsModule {
}
