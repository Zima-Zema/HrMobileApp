import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestLeavePage } from './request-leave';
import { ChartsModule } from 'ng2-charts/ng2-charts';
@NgModule({
  declarations: [
    RequestLeavePage,
    
  ],
  imports: [
    IonicPageModule.forChild(RequestLeavePage),
    ChartsModule
  ]
})
export class RequestLeavePageModule {}
