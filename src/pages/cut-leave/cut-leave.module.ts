import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CutLeavePage } from './cut-leave';
import { DatePickerModule } from 'ion-datepicker';
@NgModule({
  declarations: [
    CutLeavePage,
  ],
  imports: [
    IonicPageModule.forChild(CutLeavePage),
    DatePickerModule
  ],
})
export class CutLeavePageModule {}
