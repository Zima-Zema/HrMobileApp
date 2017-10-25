import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  language: string;
  enableSave;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private translationService: TranslateService, public navParams: NavParams, private storage: Storage) {
    this.storage.get("Lang").then((data) => {
      if (data) {
        this.language = data;
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  languageChange(language) {
    console.log(`Selected language: ${language}`);
    this.enableSave = true;

  }
  Save() {
    console.log(`Saved Lang: ${typeof this.language}`);
    this.storage.set("Lang", this.language).then(() => {
      this.enableSave = false;
      let a: any = {};

      this.translationService.get('ALERT_TITLE').subscribe(t => {
        a.title = t;
      });

      this.translationService.get('ALERT_message').subscribe(t => {
        a.message = t;
      });
      this.translationService.get('ALERT_YES').subscribe(t => {
        a.ok = t;
      });
      this.translationService.get('ALERT_NO').subscribe((data) => {
        a.cancel = data;
      })
      this.alertCtrl.create({
        title: a.title,
        message:  a.message,
        buttons: [{
          text: a.ok,
          handler: () => {
            window.location.reload();
          }
        },
        {
          text: a.cancel,
          role: 'cancel'
        }
        ]
      }).present();


    })
  }

}
