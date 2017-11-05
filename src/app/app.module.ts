import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule, Http } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AppMinimize } from '@ionic-native/app-minimize';
//
import { MyApp } from './app.component';
// plugins
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Network } from '@ionic-native/network';
import 'signalr';

// pages
import { HomePage } from '../pages/home/home';
import { LogInPageModule } from '../pages/log-in/log-in.module';
import { NotificationsPageModule } from '../pages/notifications/notifications.module';

import { NotificationDetailsPageModule } from '../pages/notification-details/notification-details.module';
import { TasksPageModule } from '../pages/tasks/tasks.module';
import { AddTaskPageModule } from '../pages/add-task/add-task.module';
import { ForceChangePasswordPageModule } from '../pages/force-change-password/force-change-password.module';
import { DoneTaskPageModule } from '../pages/done-task/done-task.module';
import { LeaveListPageModule } from '../pages/leave-list/leave-list.module';
import { RequestLeavePageModule } from '../pages/request-leave/request-leave.module';
import { LeaveEditPageModule } from '../pages/leave-edit/leave-edit.module';
import { CutLeavePageModule} from '../pages/cut-leave/cut-leave.module';
import { AssignOrderPageModule} from '../pages/AssignOrder/assign-order/assign-order.module'
import { AddAssignOrderPageModule} from '../pages/AssignOrder/add-assign-order/add-assign-order.module'
//from Ali
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SettingsPageModule } from '../pages/settings/settings.module';

export function setTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// 
//
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({ driverOrder: ["localstorage", "websql"] }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [Http]
      }
    }),
    LogInPageModule,
    NotificationsPageModule,
    NotificationDetailsPageModule,
    TasksPageModule,
    AddTaskPageModule,
    ForceChangePasswordPageModule,
    DoneTaskPageModule,
    HttpModule,
    LeaveListPageModule,
    RequestLeavePageModule,
    LeaveEditPageModule,
    SettingsPageModule,
    CutLeavePageModule,
    AssignOrderPageModule,
    AddAssignOrderPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    File,
    BackgroundMode,
    LocalNotifications,
    FileChooser,
    FilePath,
    Camera,
    Network,
    AppMinimize,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
