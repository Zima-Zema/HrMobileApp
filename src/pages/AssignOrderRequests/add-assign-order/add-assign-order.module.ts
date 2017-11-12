import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAssignOrderPage } from './add-assign-order';
import { DatePickerModule } from 'ion-datepicker';
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../../pipes/pipes.module";
@NgModule({
  declarations: [
    AddAssignOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAssignOrderPage),
    DatePickerModule,
    PipesModule,
    TranslateModule
  ],
})
export class AddAssignOrderPageModule { }
