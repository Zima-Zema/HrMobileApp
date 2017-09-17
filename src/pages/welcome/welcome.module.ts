import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { NotificationServiceApi} from '../../shared/NotificationService';
import { LocalNotifications } from '@ionic-native/local-notifications';
@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
  ],
   providers: [NotificationServiceApi,LocalNotifications]
})
export class WelcomePageModule {}
