import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoneTaskPage } from './done-task';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    DoneTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(DoneTaskPage),
    TranslateModule
  ],
})
export class DoneTaskPageModule {}
