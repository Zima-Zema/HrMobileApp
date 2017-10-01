import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RequestLeavePage } from '../request-leave/request-leave';
import { LeaveServicesApi, IRequestType } from '../../shared/LeavesService';
import * as moment from 'moment';
import * as _ from 'lodash';

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
  public img_color: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveListPage');
  }
  ionViewWillEnter() {
    var LeavesLoader = this.loadingCtrl.create({
      content: "Loading Leaves..."
    });
    LeavesLoader.present().then(() => {
      this.LeaveServices.getLeaves(this.RequestTypeObj).subscribe((data) => {
        console.log("getLeavesdata ", data);
        this.LeavesCount = data.length;
        data.forEach(element => {
          element.StartDate = moment(element.StartDate).format('ddd, MMM DD, YYYY');
          element.ReturnDate = moment(element.ReturnDate).format('ddd, MMM DD, YYYY');
        });
        
        this.LeavesData = _.chain(data).groupBy('Type').toPairs()
          .map(item => _.zipObject(['divisionType', 'divisionTypes'], item)).value();

       // this.LeavesData = data;
        LeavesLoader.dismiss();
      }, (e) => {
        console.log("error ", e);
        let toast = this.toastCtrl.create({
          message: "Error in getting Leaves, Please Try again later.",
          duration: 3000,
          position: 'middle'
        });
        LeavesLoader.dismiss().then(() => {
          toast.present();
        });
      })
    });

  }

  addLeave() {
    this.navCtrl.push(RequestLeavePage);
  }

}
