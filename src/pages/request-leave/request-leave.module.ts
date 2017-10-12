import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestLeavePage } from './request-leave';
import { DatePickerModule } from 'ion-datepicker';

@NgModule({
  declarations: [
    RequestLeavePage,
    
  ],
  imports: [
    IonicPageModule.forChild(RequestLeavePage),
    DatePickerModule
  ]
})
export class RequestLeavePageModule { }
