import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { RequestLeavePage } from '../../Leaves/request-leave/request-leave';
import { AddAssignOrderPage } from '../../AssignOrderRequests/add-assign-order/add-assign-order';
import { Storage } from '@ionic/storage';
import { IUser } from "../../../shared/IUser";
import { ResignRequestPage} from '../../resign-request/resign-request';

@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  user: IUser;
  isManager: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public app: App) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.isManager = (this.user.Roles.indexOf("Manager") == -1) ? false : true;
      }
    });
    //fixed-content
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }
  gotoEditProfile() {
    console.log("EditProfile");
  }
  gotoLeaveRequests() {
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
  gotoResignRequest(){
    this.app.getRootNav().push(ResignRequestPage);
  }
}
