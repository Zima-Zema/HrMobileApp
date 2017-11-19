import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-show-assign-order',
  templateUrl: 'show-assign-order.html',
})
export class ShowAssignOrderPage {
  public AssignorderDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.AssignorderDetails = this.navParams.data;
  }

  ionViewDidLoad() {


  }


}
