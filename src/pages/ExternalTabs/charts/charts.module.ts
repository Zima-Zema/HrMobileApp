import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartsPage } from './charts';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartsPage),
    TranslateModule
  ],
})
export class ChartsPageModule {}
