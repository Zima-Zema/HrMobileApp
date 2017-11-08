import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignOrderRequestsPage } from './assign-order-requests';
import { PipesModule } from "../../../pipes/pipes.module";
@NgModule({
  declarations: [
    AssignOrderRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignOrderRequestsPage),
    PipesModule
  ],
})
export class AssignOrderRequestsPageModule {}
