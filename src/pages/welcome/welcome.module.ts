import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { NotificationServiceApi} from '../../shared/NotificationService'
@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
  ],
   providers: [NotificationServiceApi]
})
export class WelcomePageModule {}
