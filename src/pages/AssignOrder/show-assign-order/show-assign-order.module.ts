import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowAssignOrderPage } from './show-assign-order';
import { PipesModule } from "../../../pipes/pipes.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ShowAssignOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowAssignOrderPage),
    PipesModule,
    TranslateModule
  ],
})
export class ShowAssignOrderPageModule {}
