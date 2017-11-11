import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationDetailsPage } from './notification-details';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    NotificationDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationDetailsPage),
    TranslateModule,
    PipesModule
  ],
})
export class NotificationDetailsPageModule {}
