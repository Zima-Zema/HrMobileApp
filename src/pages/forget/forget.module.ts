import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgetPage } from './forget';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ForgetPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgetPage),
    TranslateModule
  ],
})
export class ForgetPageModule {}
