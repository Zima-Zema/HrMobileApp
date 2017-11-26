import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-show-assign-order-requests',
  templateUrl: 'show-assign-order-requests.html',
})
export class ShowAssignOrderRequestsPage {
  public AssignorderDetails;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.AssignorderDetails = this.navParams.data;
    
  }

  ionViewDidLoad() {
  }

}
