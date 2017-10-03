import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RequestLeavePage } from '../request-leave/request-leave';
import { LeaveEditPage } from '../leave-edit/leave-edit';
import { LeaveServicesApi, IRequestType } from '../../shared/LeavesService';
import * as moment from 'moment';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-leave-list',
  templateUrl: 'leave-list.html',
})

export class LeaveListPage {
  public toggled: boolean = false;
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
  public LeavesFilter: Array<any> = [];
  public queryText: string;
  public Leaves_Arr: Array<any> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  public toggle(): void {
    this.toggled = this.toggled ? false : true;
  }

  ionViewDidLoad() {
    this.Leaves_Arr = [];
    var LeavesLoader = this.loadingCtrl.create({
      content: "Loading Leaves..."
    });
    LeavesLoader.present().then(() => {
      this.LeaveServices.getLeaves(this.RequestTypeObj).subscribe((data) => {
        this.LeavesCount = data.length;
        data.forEach(element => {
          element.StartDate = moment(element.StartDate).format('ddd, MMM DD, YYYY');
          element.ReturnDate = moment(element.ReturnDate).format('ddd, MMM DD, YYYY');
          element.EndDate=moment(element.EndDate).format('ddd, MMM DD, YYYY');
        });

        this.LeavesData = _.chain(data).groupBy('Type').toPairs()
          .map(item => _.zipObject(['divisionType', 'divisionTypes'], item)).value();
        this.Leaves_Arr = this.LeavesData;
        LeavesLoader.dismiss();
      }, (e) => {
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
  ionViewWillEnter() {
    this.toggled = false;
  }

  filterItems() {
    this.Leaves_Arr = [];
    let val = this.queryText.toLowerCase();
    _.forEach(this.LeavesData, td => {
      let leavs = _.filter(td.divisionTypes, t => (<any>t).StartDate.toLowerCase().includes(val));
      if (leavs.length) {
        this.LeavesFilter.push({ divisionType: td.divisionType, divisionTypes: leavs });
      }
    });
    this.Leaves_Arr = this.LeavesFilter;
    this.LeavesFilter = [];
  }

  addLeave() {
    this.navCtrl.push(RequestLeavePage);
  }
  EditLeaves(item) {
    //this.navCtrl.push(LeaveEditPage,item);
    this.navCtrl.push(RequestLeavePage,item);
  }

}
