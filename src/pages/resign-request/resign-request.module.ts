import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResignRequestPage } from './resign-request';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerModule } from 'ion-datepicker';
@NgModule({
  declarations: [
    ResignRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ResignRequestPage),
    TranslateModule,
    DatePickerModule
  ],
})
export class ResignRequestPageModule {}
