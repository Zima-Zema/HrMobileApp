import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


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
