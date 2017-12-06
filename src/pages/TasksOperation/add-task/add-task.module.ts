import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTaskPage } from './add-task';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AddTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTaskPage),
    TranslateModule
  ],
})
export class AddTaskPageModule {}
