import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestLeavePage } from '../request-leave/request-leave';
import { LeaveServicesApi, IRequestType } from '../../shared/LeavesService';

@IonicPage()
@Component({
  selector: 'page-leave-list',
  templateUrl: 'leave-list.html',
})

export class LeaveListPage {

  RequestTypeObj: IRequestType = {
    CompId: 0,
    Culture: "ar-EG",
    EmpId: 1072
    //17 
  }
  public LeavesData: Array<any> = [];
  public Status: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveListPage');
  }
  ionViewWillEnter() {
    this.LeaveServices.getLeaves(this.RequestTypeObj).subscribe((data) => {
      console.log("getLeavesdata ", data);
      this.LeavesData = data;
    }, (e) => {
      console.log("error ", e);
    })
  }

  addLeave() {
    this.navCtrl.push(RequestLeavePage);
  }

}
