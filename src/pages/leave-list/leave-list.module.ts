import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveListPage } from './leave-list';
import { LeaveServicesApi} from '../../shared/LeavesService';

@NgModule({
  declarations: [
    LeaveListPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveListPage),
  ],
  providers:[
    LeaveServicesApi
  ]
})
export class LeaveListPageModule {}
