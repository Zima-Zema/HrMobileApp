import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
@IonicPage()
@Component({
  selector: 'page-force-change-password',
  templateUrl: 'force-change-password.html',
})
export class ForceChangePasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  GoToWelcome() {
    this.navCtrl.setRoot(WelcomePage);
    this.navCtrl.popToRoot();
  }

}
