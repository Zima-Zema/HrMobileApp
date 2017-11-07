import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveEditPage } from './leave-edit';
import { DatePickerModule } from 'ion-datepicker';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from "../../../pipes/pipes.module";
@NgModule({
  declarations: [
    LeaveEditPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveEditPage),
    DatePickerModule,
    Ionic2RatingModule,
    TranslateModule,
    PipesModule
  ],
})
export class LeaveEditPageModule { }
