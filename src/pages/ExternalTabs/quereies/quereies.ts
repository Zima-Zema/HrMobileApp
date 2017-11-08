import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LeaveListPage } from '../../Leaves/leave-list/leave-list';
import { AssignOrderPage } from '../../AssignOrder/assign-order/assign-order'
import { AssignOrderRequestsPage } from '../../AssignOrderRequests/assign-order-requests/assign-order-requests'
import { TasksPage } from '../../tasks/tasks'

@IonicPage()
@Component({
  selector: 'page-quereies',
  templateUrl: 'quereies.html',
})
export class QuereiesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App) {
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

  }

  gotoSalary() {

  }

  gotoPapers() {

  }

}
