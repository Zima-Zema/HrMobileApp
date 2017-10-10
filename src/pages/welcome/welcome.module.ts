import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { NotificationServiceApi} from '../../shared/NotificationService';
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    TranslateModule
  ],
   providers: [NotificationServiceApi]
})
export class WelcomePageModule {}
