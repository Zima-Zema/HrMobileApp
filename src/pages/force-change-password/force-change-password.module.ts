import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForceChangePasswordPage } from './force-change-password';

@NgModule({
  declarations: [
    ForceChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForceChangePasswordPage),
  ],
})
export class ForceChangePasswordPageModule {}
