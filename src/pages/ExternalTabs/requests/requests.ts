import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { RequestLeavePage } from '../../Leaves/request-leave/request-leave';
import { AddAssignOrderPage} from '../../AssignOrderRequests/add-assign-order/add-assign-order';
@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,public app :App) {
    //fixed-content
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }
  gotoEditProfile() {
    console.log("EditProfile");
  }
  gotoLeaveRequests() {
    //this.navCtrl.push(RequestLeavePage);
    this.app.getRootNav().push(RequestLeavePage)
  }
  gotoSalaryAdvanceRequests() {
    
  }
  gotoAskingPermission() {

  }
  gotoComplaint() {

  }
  gotoTaskRequests() {

  }
  gotoAssignOrderRequests() {
    //this.navCtrl.push(AssignOrderRequestsPage);
    this.app.getRootNav().push(AddAssignOrderPage)
  }
}
