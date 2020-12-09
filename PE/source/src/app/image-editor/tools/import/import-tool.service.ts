import {Injectable} from '@angular/core';
import {HistoryToolService} from '../../history/history-tool.service';
import {CanvasService} from '../../canvas/canvas.service';
import {Toast} from 'common/core/ui/toast.service';
import {Settings} from 'common/core/config/settings.service';
import {Image} from 'fabric/fabric-impl';
import {FrameToolService} from '../frame/frame-tool.service';
import {CropZoneService} from '../crop/crop-zone.service';
import {ImportToolValidator} from './import-tool-validator';
import {UploadedFile} from '../../../../common/uploads/uploaded-file';
import {openUploadWindow} from '../../../../common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../common/uploads/upload-input-config';

@Injectable()
export class ImportToolService {
    constructor(
        private history: HistoryToolService,
        private canvas: CanvasService,
        private toast: Toast,
        private config: Settings,
        private frame: FrameToolService,
        private cropzone: CropZoneService,
        private validator: ImportToolValidator,
    ) {}

    /**
     * Open upload dialog, import selected file and open it in editor.
     */
    public openUploadDialog(options: {type?: 'image'|'state', backgroundImage?: boolean} = {type: 'image'}): Promise<any> {
        const accept = this.getUploadAcceptString(options.type);

        return new Promise(resolve => {
            openUploadWindow({extensions: accept}).then(files => {
                this.validateAndGetData(files[0]).then(file => {
                    this.executeOnFileOpenCallback(files[0]);

                    if (options.backgroundImage && file.extension !== 'json') {
                        this.openBackgroundImage(file.data).then(obj => resolve(obj));
                    } else {
                        this.openFile(file.data, file.extension).then(obj => resolve(obj));
                    }
                }, () => {});
            });
        });
    }

    /**
     * Open upload dialog, import file and return files data.
     */
    public importAndGetData(): Promise<string> {
        return new Promise(resolve => {
            openUploadWindow({types: [UploadInputTypes.image]}).then(files => {
                this.validateAndGetData(files[0]).then(file => resolve(file.data));
            });
        });
    }

    /**
     * File specified file and if it passes, return files data.
     */
    public validateAndGetData(file: UploadedFile): Promise<{ data: string, extension: string }> {
        const validation = this.validator.validate(file),
        extension = file.extension;

        return new Promise((resolve, reject) => {
            if (validation.failed) {
                return reject();
            }

            this.readFile(file, extension).then(data => resolve({data, extension}));
        });
    }

    /**
     * Load specified pixie state data into editor.
     */
    public openStateFile(data: string): Promise<any> {
        return this.resetEditor().then(() => {
            return this.history.addFromJson(data);
        });
    }

    public resetEditor(params: {preserveHistory?: boolean} = {}): Promise<any> {
        // reset UI
        this.canvas.fabric().clear();
        this.frame.remove();
        this.cropzone.remove();
        if ( ! params.preserveHistory) {
            this.history.clear();
        }

        // remove previous image and canvas size
        this.config.merge({pixie: {image: null, blankCanvasSize: null}});

        return new Promise(resolve => setTimeout(() => resolve()));
    }

    /**
     * Open specified data or image element in editor.
     */
    public openFile(data: string|HTMLImageElement, extension: string = 'png'): Promise<Image|void> {
        if (data instanceof HTMLImageElement) data = data.src;

        if (extension === 'json') {
            return this.openStateFile(data);
        } else {
            return this.canvas.openImage(data);
        }
    }

    /**
     * Open specified data or image as background image.
     */
    public openBackgroundImage(data: string|HTMLImageElement): Promise<Image> {
        return this.resetEditor({preserveHistory: true}).then(() => {
            if (data instanceof HTMLImageElement) data = data.src;
            return this.canvas.loadMainImage(data);
        });
    }

    /**
     * Read specified file and get its data.
     */
    private readFile(file: UploadedFile, extension: string): Promise<string> {
        const reader = new FileReader();

        return new Promise(resolve => {
            reader.addEventListener('load', () => {
                resolve(reader.result as string);
            });

            if (extension === 'json') {
                reader.readAsText(file.native);
            } else {
                reader.readAsDataURL(file.native);
            }
        });
    }

    private getUploadAcceptString(type: 'image'|'state'|'all' = 'all'): string[] {
        switch (type) {
            case 'image':
                return ['image/*'];
            case 'state':
                return ['.json', 'application/json'];
            case 'all':
            default:
                return ['image/*', '.json', 'application/json'];
        }
    }

    private executeOnFileOpenCallback(file: UploadedFile) {
        const callback = this.config.get('pixie.onFileOpen') as Function;
        if (callback) callback(file);
    }
}
