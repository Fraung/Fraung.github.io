import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {PixieBootstrapper} from './app/image-editor/pixie-bootstrapper';
import {AppModule} from './app/app.module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import "hammerjs";

if (environment.production) {
    enableProdMode();
}

function noopBoot() {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.log(err));
}

window['Pixie'] = PixieBootstrapper;

