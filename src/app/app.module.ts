import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule,Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AppMinimize } from '@ionic-native/app-minimize';
//
import { MyApp } from './app.component';
// plugins
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera } from '@ionic-native/camera';
import { ElasticModule } from 'angular2-elastic';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Network } from '@ionic-native/network';
import 'signalr';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SignalRModule, SignalRConfiguration } from 'ng2-signalr';
// pages
import { HomePage } from '../pages/home/home';
import { LogInPageModule } from '../pages/log-in/log-in.module';
import { NotificationsPageModule } from '../pages/notifications/notifications.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { NotificationDetailsPageModule } from '../pages/notification-details/notification-details.module';
import { TasksPageModule } from '../pages/tasks/tasks.module';
import { AddTaskPageModule } from '../pages/add-task/add-task.module';
import { ForceChangePasswordPageModule } from '../pages/force-change-password/force-change-password.module';
import { DoneTaskPageModule } from '../pages/done-task/done-task.module';
import { LeaveListPageModule} from '../pages/leave-list/leave-list.module';
import { RequestLeavePageModule} from '../pages/request-leave/request-leave.module';
//from Ali
export function creatConfig(): SignalRConfiguration {
  // let _store: Storage;
  // let baseUrl: string = '';
  // _store.get("BaseURL").then((val) => {
  //   this.baseURL = val;
  //   console.log("BaseUrl From Notity services>>>", this.baseURL);
  // });
  const config = new SignalRConfiguration();
  config.hubName = 'MyHub';
  config.url = 'http://www.enterprise-hr.com/';
  config.logging = true;
  config.withCredentials = true;
  return config;
}
//
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SignalRModule.forRoot(creatConfig),
    IonicStorageModule.forRoot({ driverOrder: ["localstorage", "websql"] }),
    LogInPageModule,
    NotificationsPageModule,
    WelcomePageModule,
    NotificationDetailsPageModule,
    TasksPageModule,
    AddTaskPageModule,
    ForceChangePasswordPageModule,
    DoneTaskPageModule,
    HttpModule,
    LeaveListPageModule,
    RequestLeavePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    ElasticModule,
    File,
    BackgroundMode,
    LocalNotifications,
    FileOpener,
    FileChooser,
    FileTransfer,
    FileTransferObject,
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
