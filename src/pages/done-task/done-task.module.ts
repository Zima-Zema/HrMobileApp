import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoneTaskPage } from './done-task';

@NgModule({
  declarations: [
    DoneTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(DoneTaskPage),
  ],
})
export class DoneTaskPageModule {}
