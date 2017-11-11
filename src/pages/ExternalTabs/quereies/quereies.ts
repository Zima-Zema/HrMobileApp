import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LeaveListPage } from '../../Leaves/leave-list/leave-list';
import { AssignOrderPage } from '../../AssignOrder/assign-order/assign-order'
import { AssignOrderRequestsPage } from '../../AssignOrderRequests/assign-order-requests/assign-order-requests'
import { TasksPage } from '../../tasks/tasks';
import { CustomLeavesPage} from '../../Leaves/custom-leaves/custom-leaves'
import { Storage } from '@ionic/storage';
import { IUser } from "../../../shared/IUser";
@IonicPage()
@Component({
  selector: 'page-quereies',
  templateUrl: 'quereies.html',
})
export class QuereiesPage {

  user: IUser;
  isManager:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage, private app: App) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.isManager = (this.user.Roles.indexOf("Manager") == -1) ? false : true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuereiesPage');
  }
  gotoMyTasks() {
    this.app.getRootNav().push(TasksPage);
  }
  gotoMyLeave() {
    this.app.getRootNav().push(LeaveListPage);
  }

  gotoMyAssignOrders() {
    this.app.getRootNav().push(AssignOrderPage)
  }

  gotoAssignOrderRequests() {
    this.app.getRootNav().push(AssignOrderRequestsPage)
  }
  gotocustodyRequests() {

  }

  gotoCustomLeaves() {
    this.app.getRootNav().push(CustomLeavesPage);
  }

  gotoSalary() {

  }

  gotoPapers() {

  }

}
