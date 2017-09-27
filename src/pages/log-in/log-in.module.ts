import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogInPage } from './log-in';
import { LoginServiceApi } from "../../shared/loginService";
import { Storage } from '@ionic/storage';
@NgModule({
  declarations: [
    LogInPage,
  ],
  imports: [
    IonicPageModule.forChild(LogInPage)
  ], providers: [LoginServiceApi]
})
export class LogInPageModule { }
