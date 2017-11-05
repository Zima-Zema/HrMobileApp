import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestLeavePage } from './request-leave';
import { DatePickerModule } from 'ion-datepicker';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [
    RequestLeavePage,

  ],
  imports: [
    IonicPageModule.forChild(RequestLeavePage),
    DatePickerModule,
    Ionic2RatingModule,
    TranslateModule
  ]
})
export class RequestLeavePageModule { }
