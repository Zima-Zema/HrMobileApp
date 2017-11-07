import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { NotificationServiceApi } from '../../shared/NotificationService';
import { TranslateModule } from '@ngx-translate/core'
import { SignalRConfiguration, SignalRModule } from 'ng2-signalr';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { LogInPage } from '../log-in/log-in';
import { ScrollableTabs} from '../../components/scrollable-tabs/scrollable-tabs'

export function creatConfig(): SignalRConfiguration {

  const config = new SignalRConfiguration();
  config.hubName = 'MyHub';
  config.logging = true;
  config.withCredentials = true;   
  return config;
}
@NgModule({
  declarations: [
    WelcomePage,
    ScrollableTabs
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    SignalRModule.forRoot(creatConfig),
    TranslateModule
  ],
  providers: [NotificationServiceApi]
})
export class WelcomePageModule {}
