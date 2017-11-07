import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsTabPage } from './settings-tab';

@NgModule({
  declarations: [
    SettingsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsTabPage),
  ],
})
export class SettingsTabPageModule {}
