import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResignRequestPage } from './resign-request';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ResignRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ResignRequestPage),
    TranslateModule
  ],
})
export class ResignRequestPageModule {}
