import {AppModule} from '../app.module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DEFAULT_CONFIG, PixieConfig, MERGED_CONFIG, PIXIE_VERSION} from './default-settings';
import merge from 'deepmerge';
import * as Dot from "dot-object";
import {ApplicationRef, Injector, NgModuleRef} from '@angular/core';
import {CanvasService} from './canvas/canvas.service';
import {Settings} from 'common/core/config/settings.service';
import {ToolsService} from './tools/tools.service';
import {SerializedCanvas} from './history/serialized-canvas';
import {HttpClient} from '@angular/common/http';
import {OpenSampleImagePanelService} from '../image-editor-ui/panels/open-sample-image-panel/open-sample-image-panel.service';
import {EditorControlsService} from '../image-editor-ui/toolbar-controls/editor-controls.service';
import {Type} from '@angular/core/src/type';
import {InjectionToken} from '@angular/core/src/di/injection_token';
import {HistoryToolService} from './history/history-tool.service';
import {ImportToolService} from './tools/import/import-tool.service';
import {Store} from '@ngxs/store';
import {CloseEditor, OpenEditor} from './state/editor-state-actions';
import {delay} from 'rxjs/operators';

export class PixieBootstrapper {
    private injector: Injector;
    public version = PIXIE_VERSION;
    private appModule: NgModuleRef<AppModule>;

    constructor(config: PixieConfig) {
        this.initPixie(config);
    }

    /**
     * Open specified image and then editor.
     */
    public openEditorWithImage(data: string|HTMLImageElement, asMainImage: boolean = true) {
        this.openFile(data, 'png', asMainImage).then(() => this.open());
    }

    /**
     * Open specified photo as main canvas image.
     */
    public openMainImage(data: string|HTMLImageElement) {
        this.openFile(data, 'png', true);
    }

    /**
     * Open specified file in the editor.
     */
    public openFile(data: string|HTMLImageElement, extension: string = 'png', asMainImage: boolean = false) {
        const importTool = this.getTool('import') as ImportToolService;

        let promise;

        if (asMainImage) {
            promise = importTool.openBackgroundImage(data);
        } else {
            promise = importTool.openFile(data, extension);
        }

        this.injector.get(ApplicationRef).tick();

        return promise;
    }

    /**
     * Open new canvas with specified with and height.
     */
    public newFile(width: number, height: number) {
        return this.getTool('canvas').openNew(width, height);
    }

    /**
     * Load canvas state from json.
     */
    public loadState(state: string|SerializedCanvas) {
        return this.getTool('history').addFromJson(state);
    }

    /**
     * Get current canvas state as json.
     */
    public getState() {
        return JSON.stringify(this.getTool('history').getCurrentCanvasState());
    }

    /**
     * Open pixie editor.
     */
    public open(config?: PixieConfig) {
        if (config) this.mergeConfig(config);
        this.get(Store).dispatch(new OpenEditor()).pipe(delay(1)).subscribe(() => {
            this.getTool('canvas').zoom.fitToScreen();
            this.get(OpenSampleImagePanelService).open();
            this.get(HistoryToolService).addInitial();
        });
    }

    /**
     * Close pixie editor.
     */
    public close() {
        return this.get(Store).dispatch(new CloseEditor());
    }

    public resetEditor(key: string|PixieConfig, value?: any) {
        return new Promise(resolve => {
            // reset fabric and UI
            this.get(ImportToolService).resetEditor();

            // set new config, if provided
            if (key) this.setConfig(key, value);

            // re-init canvas
            this.getTool('canvas').initContent().then(() => {
                this.get(EditorControlsService).closeCurrentPanel();
                this.get(OpenSampleImagePanelService).open();
                if (key) this.get(HistoryToolService).addInitial();
                resolve();
            });
        });
    }

    public resetAndOpenEditor(key: string|PixieConfig, value?: any) {
        this.resetEditor(key, value).then(() => this.open());
    }

    /**
     * Set specified config value via dot notation.
     */
    public setConfig(key: string|PixieConfig, value?: any) {
        const settings = this.get(Settings);

        // set config if key and value is provided
        if (typeof key === 'string' && typeof value !== 'undefined') {
            const prefixedKey = key.indexOf('vebto.') > -1 ? key : 'pixie.' + key;
            settings.set(prefixedKey, value, true);

        // set config if config object is provided
        } else if (typeof key === 'object') {
            const config = {pixie: key};

            if (config.pixie['sentry_public']) {
                settings.set('logging.sentry_public', config.pixie['sentry_public']);
            }

            settings.merge(config, true);
        }

    }

    public getDefaultConfig(key: string): any {
        return Dot.pick(key, DEFAULT_CONFIG);
    }

    /**
     * Get pixie http client.
     */
    public http(): HttpClient {
        return this.get(HttpClient);
    }

    /**
     * Get pixie tool by specified name.
     */
    public getTool(name: string) {
        if ( ! this.injector) throw('Pixie is not loaded yet. Are you using "onLoad" callback?');
        return this.get(ToolsService).get(name);
    }

    public get<T>(token: Type<T> | InjectionToken<T>): T {
        return this.injector.get(token);
    }

    private initPixie(config: PixieConfig) {
        const merged = this.mergeConfig(config);

        platformBrowserDynamic([{provide: MERGED_CONFIG, useValue: merged}])
            .bootstrapModule(AppModule)
            .then(this.onAngularReady.bind(this))
            .catch(err => console.log(err));
    }

    private mergeConfig(userConfig: PixieConfig) {
        const merged = merge(DEFAULT_CONFIG, userConfig || {});
        return this.replaceDefaultConfigItems(merged, userConfig);
    }

    /**
     * Remove default items if "replaceDefault" is true in user config.
     */
    private replaceDefaultConfigItems(config: object, userConfig: object) {
        for (let key in config) {
            if (key === 'replaceDefault' && config[key]) {
                config['items'] = userConfig ? userConfig['items'] : [];
            } else if (typeof config[key] === 'object') {
                this.replaceDefaultConfigItems(config[key], userConfig && userConfig[key]);
            }
        }

        return config;
    }

    private onAngularReady(appModule: NgModuleRef<AppModule>) {
        this.appModule = appModule;
        this.injector = appModule.injector;
        this.get(CanvasService).state.loaded.subscribe(() => {
            const settings = this.get(Settings);
            const onLoad = settings.get('pixie.onLoad') as Function;
            if (onLoad) onLoad();
        });
    }

    public destroyEditor() {
        this.appModule.destroy();
        this.appModule = null;
    }
}