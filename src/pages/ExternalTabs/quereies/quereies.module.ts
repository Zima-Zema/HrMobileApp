import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuereiesPage } from './quereies';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QuereiesPage,
  ],
  imports: [
    IonicPageModule.forChild(QuereiesPage),
    TranslateModule
  ],
})
export class QuereiesPageModule {}
