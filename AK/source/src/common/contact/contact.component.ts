import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Settings} from '../core/config/settings.service';
import {AppHttpClient} from '../core/http/app-http-client.service';
import {Toast} from '../core/ui/toast.service';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import { LazyLoaderService } from '../core/utils/lazy-loader.service';

declare var grecaptcha: any;
const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js?render=';

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ContactComponent implements OnInit {
    public loading = new BehaviorSubject(false);

    public model = new FormGroup({
        name: new FormControl(),
        email: new FormControl(),
        message: new FormControl()
    });

    public errors: {
        name?: string;
        email?: string;
        message?: string;
    } = {};

    constructor(
        public settings: Settings,
        private http: AppHttpClient,
        private toast: Toast,
        private router: Router,
        private lazyLoader: LazyLoaderService,
    ) {}

    ngOnInit() {
        this.loadRecaptcha();
    }

    public async submitMessage() {
        this.loading.next(true);

        if ( ! await this.verifyRecaptcha()) {
            return this.toast.open('Could not verify you are human.');
        }

        this.http.post('contact-page', this.model.value)
            .pipe(finalize(() => {
                this.loading.next(false);
            })).subscribe(() => {
                this.errors = {};
                this.toast.open('Your message has been submitted.');
                this.router.navigate(['/']);
            }, errorResponse => {
                this.errors = errorResponse.messages;
            });
    }

    private loadRecaptcha() {
        this.lazyLoader.loadScript(RECAPTCHA_URL + this.settings.get('recaptcha.site_key'));
    }

    private verifyRecaptcha(): Promise<boolean> {
        return new Promise(resolve => {
            if ( ! grecaptcha) return false;
            grecaptcha.ready(() => {
                grecaptcha.execute(this.settings.get('recaptcha.site_key'), {action: 'contact_page'})
                    .then(token => {
                        this.http.post('recaptcha/verify', {token})
                            .subscribe(response => resolve(response.success));
                    });
            });
        });
    }
}
