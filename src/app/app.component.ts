import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LogInPage } from '../pages/log-in/log-in';
import { HomePage } from '../pages/home/home';
import { BackgroundMode } from '@ionic-native/background-mode';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LogInPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.backgroundMode.enable();
      this.backgroundMode.overrideBackButton();
    });
  }
}

