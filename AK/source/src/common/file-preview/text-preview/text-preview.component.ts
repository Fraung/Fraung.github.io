import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseFilePreview } from '../base-file-preview';

@Component({
    selector: 'text-preview',
    templateUrl: './text-preview.component.html',
    styleUrls: ['./text-preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPreviewComponent extends BaseFilePreview implements OnInit {
    @HostBinding('class') className = 'preview-object';
    public content = new BehaviorSubject('');

    ngOnInit() {
        this.getContents()
            .subscribe(content => this.content.next(content));
    }
}
