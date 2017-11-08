import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowAssignOrderPage } from './show-assign-order';
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ShowAssignOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowAssignOrderPage),
    PipesModule
  ],
})
export class ShowAssignOrderPageModule {}
