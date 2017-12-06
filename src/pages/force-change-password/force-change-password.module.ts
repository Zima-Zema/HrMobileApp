import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForceChangePasswordPage } from './force-change-password';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ForceChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForceChangePasswordPage),
    TranslateModule
  ],
})
export class ForceChangePasswordPageModule {}
