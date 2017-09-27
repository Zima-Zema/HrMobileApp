import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveListPage } from './leave-list';
import { LeaveServicesApi} from '../../shared/LeavesService';
import { PipesModule } from "../../pipes/pipes.module";
@NgModule({
  declarations: [
    LeaveListPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveListPage),
    PipesModule
  ],
  providers:[
    LeaveServicesApi
  ]
})
export class LeaveListPageModule {}
