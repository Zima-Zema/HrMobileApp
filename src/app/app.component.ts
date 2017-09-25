import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LogInPage } from '../pages/log-in/log-in';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LogInPage;
  @ViewChild('myNav') nav: NavController;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private backgroundMode: BackgroundMode, public localNotifications: LocalNotifications) {
    platform.ready().then(() => {


      statusBar.styleDefault();
      splashScreen.hide();
      this.backgroundMode.enable();
      this.localNotifications.registerPermission();

      platform.registerBackButtonAction((event) => {
        // this.appMinimize.minimize();

        if (this.nav.canGoBack) {
          this.nav.pop();
        }
        if (this.nav.length() <= 1) {
          this.backgroundMode.moveToBackground();
        }
      });
      // this.backgroundMode.on("deactivate").subscribe(() => {
      //   this.backgroundMode.enable();
      //   this.backgroundMode.moveToBackground();
      // })
      this.backgroundMode.on("activate").subscribe(() => {
        this.backgroundMode.disableWebViewOptimizations();
      })
      // this.backgroundMode.overrideBackButton();
    });
  }
}

