import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CutLeavePage } from './cut-leave';
import { DatePickerModule } from 'ion-datepicker';
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [
    CutLeavePage,
  ],
  imports: [
    IonicPageModule.forChild(CutLeavePage),
    DatePickerModule,
    TranslateModule
  ],
})
export class CutLeavePageModule {}
