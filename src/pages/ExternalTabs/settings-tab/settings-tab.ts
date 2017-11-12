import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SettingsPage } from '../../settings/settings'
import { Storage } from '@ionic/storage';
import { LogInPage } from "../../log-in/log-in";

@IonicPage()
@Component({
  selector: 'page-settings-tab',
  templateUrl: 'settings-tab.html',
})
export class SettingsTabPage {
  //public user_name: string = "";
  //public user_email: string = "";
  public User: any;
  baseUrl: string = "";
  constructor(public navCtrl: NavController,
    public navParams: NavParams
    , private app: App,
    private storage: Storage) {

    this.storage.get("User").then((udata) => {
      if (udata) {
        console.log("udata ", udata);
        this.User=udata;
      }
    });

    this.storage.get("BaseURL").then((val) => {
      this.baseUrl = val;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsTabPage');
  }
  gotoLanguage() {
    this.app.getRootNav().push(SettingsPage);
  }
  logout(){
    this.storage.clear();
    this.app.getRootNav().push(LogInPage);
    //this.navCtrl.popToRoot();
  }

}
