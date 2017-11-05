import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignOrderPage } from './assign-order';
import { AssignOrderServicesApi} from '../../../shared/AssignOrderService';
@NgModule({
  declarations: [
    AssignOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignOrderPage),
  ],
  providers:[
    AssignOrderServicesApi
  ]
})
export class AssignOrderPageModule {}
