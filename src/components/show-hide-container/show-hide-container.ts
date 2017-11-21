import { Component, ContentChild } from '@angular/core'
import { ShowHideInputDirective } from '../../directives/show-hide-input/show-hide-input';


@Component({
    selector: 'show-hide-container',
    template: `<ng-content></ng-content>
                       <a (click)="toggleShow($event)">show/hide</a>`,
    styles: ['.show-hide {padding-right: 16px;}'],

})
export class ShowHideContainerComponent {
    show = false;

    @ContentChild(ShowHideInputDirective) input: ShowHideInputDirective;

    constructor() { }

    toggleShow() {
        this.show = !this.show;
        if (this.show) {
            this.input.changeType("text");
        }
        else {
            this.input.changeType("password");
        }
    }
}