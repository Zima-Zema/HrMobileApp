import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LeaveListPage } from '../../Leaves/leave-list/leave-list';
import { AssignOrderPage } from '../../AssignOrder/assign-order/assign-order'
import { AssignOrderRequestsPage } from '../../AssignOrderRequests/assign-order-requests/assign-order-requests'
import { TasksPage } from '../../TasksOperation/tasks/tasks';
import { CustomLeavesPage } from '../../Leaves/custom-leaves/custom-leaves'
import { Storage } from '@ionic/storage';
import { IUser } from "../../../shared/IUser";
import { CustodyListPage } from '../../custody-list/custody-list';
import { TransLeavesPage} from '../../Leaves/trans-leaves/trans-leaves'
import { DocumentsPage } from '../../documents/documents';


@IonicPage()
@Component({
  selector: 'page-quereies',
  templateUrl: 'quereies.html',
})
export class QuereiesPage {

  user: IUser;
  isManager: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private app: App) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.isManager = (this.user.Roles.indexOf("Manager") == -1) ? false : true;
      }
    });
  }

  ionViewDidLoad() {
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
    this.app.getRootNav().push(CustodyListPage);
  }

  gotoCustomLeaves() {
    this.app.getRootNav().push(CustomLeavesPage);
  }

  gotoTransLeaves(){
    this.app.getRootNav().push(TransLeavesPage);
  }

  gotoSalary() {

  }

  gotoPapers() {
    this.app.getRootNav().push(DocumentsPage);
  }0



}
