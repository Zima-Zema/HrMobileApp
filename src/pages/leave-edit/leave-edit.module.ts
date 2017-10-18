import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveEditPage } from './leave-edit';
import { DatePickerModule } from 'ion-datepicker';

@NgModule({
  declarations: [
    LeaveEditPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveEditPage),
    DatePickerModule
  ],
})
export class LeaveEditPageModule {}
