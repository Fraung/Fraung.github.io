import {ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {GoogleFontsPanelComponent} from '../google-fonts-panel/google-fonts-panel.component';
import {BOTTOM_POSITION} from '../../../../../common/core/ui/overlay-panel/positions/bottom-position';
import {OverlayPanel} from '../../../../../common/core/ui/overlay-panel/overlay-panel.service';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'text-font-selector',
    templateUrl: './text-font-selector.component.html',
    styleUrls: ['./text-font-selector.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: TextFontSelectorComponent,
        multi: true,
    }]
})
export class TextFontSelectorComponent {
    public selectedFont$ = new BehaviorSubject(null);
    public propagateChange: Function;

    constructor(private overlayPanel: OverlayPanel) {}

    public openGoogleFontsPanel() {
        this.overlayPanel.open(
            GoogleFontsPanelComponent,
            {
                position: 'center',
                origin: 'global',
            })
            .valueChanged().subscribe(fontFamily => {
                this.selectedFont$.next(fontFamily);
                this.propagateChange(fontFamily);
            });
    }

    public writeValue(value: string|null) {
        this.selectedFont$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}
}
