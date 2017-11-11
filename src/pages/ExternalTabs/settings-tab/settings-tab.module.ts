import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsTabPage } from './settings-tab';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SettingsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsTabPage),
    TranslateModule
  ],
})
export class SettingsTabPageModule {}
