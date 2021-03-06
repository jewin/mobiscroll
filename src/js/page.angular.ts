import {
    extend,
    Component,
    mobiscroll,
    MbscBase,
    ElementRef,
    ViewChild,
    Input,
    OnInit,
    MbscOptionsService
} from './frameworks/angular';

import { Page } from './classes/page';

import { MbscCoreOptions } from './core/core';

export interface MbscPageOptions extends MbscCoreOptions {
    // Settings
    context?: string | HTMLElement;
}

@Component({
    selector: 'mbsc-page',
    template: '<div #initElement><ng-content></ng-content></div>',
    providers: [MbscOptionsService]
})
export class MbscPage extends MbscBase implements OnInit {
    @Input()
    options: MbscPageOptions;

    @ViewChild('initElement')
    initElem: ElementRef;

    constructor(hostElement: ElementRef, public optionsService: MbscOptionsService) {
        super(hostElement);
    }

    ngOnInit() {
        let optionsObj = extend({}, this.options, this.inlineOptions());
        this.optionsService.options = optionsObj;
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        let options = extend({}, this.inlineEvents(), this.options, this.inlineOptions());
        this._instance = new Page(this.initElem.nativeElement, options);
    }
}

@Component({
    selector: 'mbsc-note',
    template: '<ng-content></ng-content>',
    host: {
        '[class]': 'classNames'
    },
    styles: [':host { display: block; }']
})
export class MbscNote {
    get classNames(): string {
        return 'mbsc-note mbsc-note-' + this.color;
    }

    @Input()
    color: string = 'primary';

    constructor(public initialElem: ElementRef) {
    }
}

@Component({
    selector: 'mbsc-avatar',
    template: '<img class="mbsc-avatar" [src]="src" [alt]="alt" />'
})
export class MbscAvatar {
    @Input()
    src: string;
    @Input()
    alt: string;
}