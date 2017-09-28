import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestLeavePage } from '../request-leave/request-leave';
import { LeaveServicesApi, IRequestType } from '../../shared/LeavesService';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-leave-list',
  templateUrl: 'leave-list.html',
})

export class LeaveListPage {

  RequestTypeObj: IRequestType = {
    CompId: 0,
    Culture: "ar-EG",
    EmpId: 
    //1
    1072
    //17 
  }
  public LeavesData: Array<any> = [];
  public LeavesCount: number = 0;

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
      this.LeavesCount=data.length;
      data.forEach(element => {

        console.log(element.StartDate)
        element.StartDate = moment(element.StartDate).format('ddd, MMM DD, YYYY');
        console.log(element.StartDate)
        element.ReturnDate = moment(element.ReturnDate).format('ddd, MMM DD, YYYY');
        console.log(element.ReturnDate)
      });
      this.LeavesData = data;
    }, (e) => {
      console.log("error ", e);
    })
  }

  addLeave() {
    this.navCtrl.push(RequestLeavePage);
  }

}
