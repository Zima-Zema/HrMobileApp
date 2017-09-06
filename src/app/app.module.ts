import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
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
import 'jquery'
import 'signalr';
import {SignalRModule, SignalRConfiguration,ConnectionTransport} from 'ng2-signalr';

export function creatConfig(): SignalRConfiguration {
  let baseUrl:string = '';
  const config = new SignalRConfiguration();
  config.hubName = 'MyHub';
  config.url='http://localhost:36207/';
  config.logging=true;
  config.withCredentials=true;
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
    IonicStorageModule.forRoot({driverOrder:["localstorage","websql"]}),
    LogInPageModule,
    NotificationsPageModule,
    WelcomePageModule,
    NotificationDetailsPageModule,
    TasksPageModule,
    AddTaskPageModule,
    ForceChangePasswordPageModule,
    DoneTaskPageModule,
    HttpModule,
    IonicStorageModule.forRoot({ driverOrder: ["localstorage", "websql"] })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    ElasticModule,
    File,
    FileOpener,
    FileChooser,
    FileTransfer,
    FileTransferObject,
    FilePath,
    Camera,
    Network,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
