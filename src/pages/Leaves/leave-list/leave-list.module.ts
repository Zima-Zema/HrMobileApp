import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveListPage } from './leave-list';
import { LeaveServicesApi} from '../../../shared/LeavesService';
import { PipesModule } from "../../../pipes/pipes.module";
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [
    LeaveListPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveListPage),
    PipesModule,
    TranslateModule
  ],
  providers:[
    LeaveServicesApi
  ]
})
export class LeaveListPageModule {}
