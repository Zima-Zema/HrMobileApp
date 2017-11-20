import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { ShowHideContainerComponent } from './show-hide-container/show-hide-container';
import { DirectivesModule } from '../directives/directives.module';
@NgModule({
	declarations: [ProgressBarComponent,
    ShowHideContainerComponent],
	imports: [DirectivesModule],
	exports: [ProgressBarComponent,
    ShowHideContainerComponent]
})
export class ComponentsModule {}
