import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-resign-request',
  templateUrl: 'resign-request.html',
})
export class ResignRequestPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResignRequestPage');
  }

  resignOrder(){
    console.log("Resign b2a")
  }

}
