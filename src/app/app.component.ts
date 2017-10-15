import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LogInPage } from '../pages/log-in/log-in';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = LogInPage;
  @ViewChild('myNav') nav: NavController;
  constructor(public platform: Platform, statusBar: StatusBar, private storage: Storage, splashScreen: SplashScreen, private backgroundMode: BackgroundMode, public localNotifications: LocalNotifications, translate: TranslateService) {
    storage.get("Lang").then((lang) => {
      if (lang) {
        translate.setDefaultLang(lang);
        if (lang === 'ar') {
          platform.setDir("rtl", true);
        }
        else {
          platform.setDir("ltr", true);
        }

      }
      else {
        translate.setDefaultLang('en');
        platform.setDir("ltr", true);
      }
    })

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.backgroundMode.enable();
      this.localNotifications.registerPermission();
      this.backgroundMode.on("activate").subscribe(() => {
        this.backgroundMode.disableWebViewOptimizations();
      })
      // this.backgroundMode.overrideBackButton();
    });
  }
}

