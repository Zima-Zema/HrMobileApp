import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveEditPage } from './leave-edit';

@NgModule({
  declarations: [
    LeaveEditPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveEditPage),
  ],
})
export class LeaveEditPageModule {}
