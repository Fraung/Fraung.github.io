import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Settings } from '../config/settings.service';
import { Translations } from '../translations/translations.service';
import { MatSnackBarRef } from '@angular/material/snack-bar/typings/snack-bar-ref';
import { SimpleSnackBar } from '@angular/material/snack-bar/typings/simple-snack-bar';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
    providedIn: 'root'
})
export class Toast {
    constructor(
        private settings: Settings,
        private i18n: Translations,
        private snackbar: MatSnackBar
    ) {}

    public open(message: string, config: { duration?: number, action?: string } = {}): MatSnackBarRef<SimpleSnackBar> {
        if ( ! config.duration && config.duration !== 0) {
            config.duration = this.settings.get('toast.default_timeout', 3000);
        }

        return this.snackbar.open(this.i18n.t(message), this.i18n.t(config.action), {duration: config.duration});
    }

    public openComponent<T>(component: ComponentType<T>, config?: {duration?: number, data?: {[key: string]: any}}) {
        return this.snackbar.openFromComponent(component, config);
    }
}
