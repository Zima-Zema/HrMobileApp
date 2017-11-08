import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { SettingsPage} from '../../settings/settings'


@IonicPage()
@Component({
  selector: 'page-settings-tab',
  templateUrl: 'settings-tab.html',
})
export class SettingsTabPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsTabPage');
  }
  gotoLanguage(){
    this.app.getRootNav().push(SettingsPage);
  }

}
