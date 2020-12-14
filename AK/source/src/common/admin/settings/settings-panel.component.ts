import {Component, ViewEncapsulation} from '@angular/core';
import {SettingsState} from './settings-state.service';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Settings} from '../../core/config/settings.service';
import {Toast} from '../../core/ui/toast.service';
import {Modal} from '../../core/ui/dialogs/modal.service';
import {Pages} from '../../core/pages/pages.service';
import {CustomHomepage} from '../../core/pages/custom-homepage.service';
import { AppHttpClient } from '../../core/http/app-http-client.service';
import {ArtisanService} from '../artisan.service';

@Component({
    selector: 'settings-panel',
    template: '',
    encapsulation: ViewEncapsulation.None,
})
export class SettingsPanelComponent {
    public loading = false;

    constructor(
        public settings: Settings,
        protected toast: Toast,
        protected http: AppHttpClient,
        protected modal: Modal,
        protected route: ActivatedRoute,
        protected pages: Pages,
        protected artisan: ArtisanService,
        protected customHomepage: CustomHomepage,
        public state: SettingsState,
    ) {}

    public setJson(name: string, value: string[]|number[]) {
        this.state.client[name] = JSON.stringify(value);
    }

    public getJson(name: string): any[] {
        const value = this.state.client[name];
        if ( ! value) return value;
        return JSON.parse(value);
    }

    /**
     * Save current settings to the server.
     */
    public saveSettings(settings?: object) {
        this.loading = true;

        this.settings.save(settings || this.state.getModified())
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toast.open('Saved settings');
            });
    }
}
