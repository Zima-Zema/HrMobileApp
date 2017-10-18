import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestLeavePage } from './request-leave';
import { DatePickerModule } from 'ion-datepicker';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    RequestLeavePage,
    
  ],
  imports: [
    IonicPageModule.forChild(RequestLeavePage),
    DatePickerModule,
    Ionic2RatingModule 
  ]
})
export class RequestLeavePageModule { }
