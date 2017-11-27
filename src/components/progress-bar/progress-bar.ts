import { Component, Input } from '@angular/core';

/**
 * Generated class for the ProgressBarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  text: string;
  @Input('progress') progress;
  // public c = Math.PI*(90*2);
  // public pct = ((100-this.progress)/100)*this.c;
  constructor() {
    
  }

}