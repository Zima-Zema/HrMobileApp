import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestLeavePage } from './request-leave';
@NgModule({
  declarations: [
    RequestLeavePage,
  ],
  imports: [
    IonicPageModule.forChild(RequestLeavePage),
  ]
})
export class RequestLeavePageModule {}
