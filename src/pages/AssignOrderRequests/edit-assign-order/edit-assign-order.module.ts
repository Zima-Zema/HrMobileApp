import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAssignOrderPage } from './edit-assign-order';
import { DatePickerModule } from 'ion-datepicker';
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../../pipes/pipes.module";
@NgModule({
  declarations: [
    EditAssignOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAssignOrderPage),
        PipesModule,
    TranslateModule,
        DatePickerModule,
  ],
})
export class EditAssignOrderPageModule {}
