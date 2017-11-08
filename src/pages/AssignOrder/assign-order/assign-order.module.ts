import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignOrderPage } from './assign-order';
import { AssignOrderServicesApi} from '../../../shared/AssignOrderService';
import { PipesModule } from "../../../pipes/pipes.module";
@NgModule({
  declarations: [
    AssignOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignOrderPage),
    PipesModule
  ],
  providers:[
    AssignOrderServicesApi
  ]
})
export class AssignOrderPageModule {}
