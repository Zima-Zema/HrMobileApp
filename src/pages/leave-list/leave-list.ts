import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { RequestLeavePage } from '../request-leave/request-leave';
import { LeaveEditPage } from '../leave-edit/leave-edit';
import { LeaveServicesApi, IRequestType, IDeleteRequest, ICancelVM } from '../../shared/LeavesService';
import { CutLeavePage} from '../cut-leave/cut-leave';
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
  CancelVMObj: ICancelVM = {
    Language: "ar-EG",
    CompanyId: 0,
    RequestId: 0
  }
  public LeavesData: Array<any> = [];
  public LeavesCount: number = 0;
  public img_color: any;
  public LeavesFilter: Array<any> = [];
  public queryText: string;
  public Leaves_Arr: Array<any> = [];
  public static motherArr = [];
  public apprNewDate: any = new Date().toLocaleDateString();
  //moment(new Date(new Date().setHours(0,0,0,0))).format().slice(0,-6);

  //new Date().toDateString();
  public apprStartDate: string;
  DeleteObj: IDeleteRequest = {
    Id: 0,
    Language: "ar-EG"
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) {
  }
  public toggle(): void {
    this.toggled = this.toggled ? false : true;
  }

  // getMoment(data) {
  //   // console.log("moment is called")
  //   return moment(data).format('ddd, MMM DD, YYYY');
  // }
  ionViewDidLoad() {
    this.Leaves_Arr = [];
    LeaveListPage.motherArr = [];
    var LeavesLoader = this.loadingCtrl.create({
      content: "Loading Leaves..."
    });
    LeavesLoader.present().then(() => {
      this.LeaveServices.getLeaves(this.RequestTypeObj).subscribe((data) => {
        console.log("From Db : ", data);


        this.LeavesCount = data.length;
        LeaveListPage.motherArr = data;
        // data.forEach(element => {
        //   element.StartDate = moment(element.StartDate).format('ddd, MMM DD, YYYY');
        //   element.ReturnDate = moment(element.ReturnDate).format('ddd, MMM DD, YYYY');
        //   element.EndDate = moment(element.EndDate).format('ddd, MMM DD, YYYY');
        // });

        this.LeavesData = _.chain(data).groupBy('Type').toPairs()
          .map(item => _.zipObject(['divisionType', 'divisionTypes'], item)).value();
        this.Leaves_Arr = this.LeavesData;
        console.log("this.Leaves_Arr : ", this.Leaves_Arr);

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
    if (LeaveListPage.motherArr.length > this.Leaves_Arr.length) {


      this.Leaves_Arr = _.chain(LeaveListPage.motherArr).groupBy('Type').toPairs()
        .map(ele => _.zipObject(['divisionType', 'divisionTypes'], ele)).value();
      this.LeavesCount = LeaveListPage.motherArr.length;
      console.log("Repeate ME ionViewWillEnter");
    }

  }

  filterItems() {
    this.Leaves_Arr = [];
    // data.forEach(element => {
    //   element.StartDate = moment(element.StartDate).format('ddd, MMM DD, YYYY');
    //   element.ReturnDate = moment(element.ReturnDate).format('ddd, MMM DD, YYYY');
    //   element.EndDate = moment(element.EndDate).format('ddd, MMM DD, YYYY');
    // });
    let val = this.queryText.toLowerCase();
    _.forEach(this.LeavesData, td => {
      let leavs = _.filter(td.divisionTypes, t => (<any>t).StartDate.toLowerCase().includes(val));
      if (leavs.length) {
        this.LeavesFilter.push({ divisionType: td.divisionType, divisionTypes: leavs });
      }
    });
    this.Leaves_Arr = this.LeavesFilter;
    this.LeavesFilter = [];
    console.log("Repeate ME filterItems");
  }
  ShowLeaves(item) {
    item.readOnly = true;
    this.navCtrl.push(RequestLeavePage, item);
  }
  addLeave() {
    this.navCtrl.push(RequestLeavePage);
  }
  EditLeaves(item) {
    item.readOnly = false;
    this.navCtrl.push(RequestLeavePage, item);
  }
  ConfirmDelete(itemLeave) {
    const alert = this.alertCtrl.create({
      title: 'Confirm Remove',
      message: 'Are you sure you want to remove this leave request?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            console.log("Confirm Delete : ", itemLeave, "--", typeof (itemLeave));
            if (typeof (itemLeave) == "number") {
              console.log("Approved");
              this.DeleteAppLeaves(itemLeave);
            }
            else if (typeof (itemLeave) == "object") {
              console.log("Normal delete");
              this.DeleteLeave(itemLeave)
            }
            //
          }
        }
      ]
    });
    alert.present();
  }
  DeleteLeave(item) {
    this.DeleteObj.Id = item.Id;
    console.log("this.DeleteObj ", this.DeleteObj)
    this.LeaveServices.removeLeaveRequest(this.DeleteObj)
      .subscribe((data) => {
        console.log("deleted", data);
        //
        LeaveListPage.motherArr = LeaveListPage.motherArr.filter((element) => {
          return element.Id !== item.Id;
        })
        this.Leaves_Arr = _.chain(LeaveListPage.motherArr).groupBy('Type').toPairs()
          .map(ele => _.zipObject(['divisionType', 'divisionTypes'], ele)).value();
        this.LeavesCount--;
        console.log("Repeate ME ConfirmDelete");
        //
        let toast = this.toastCtrl.create({
          message: "Leave Is Deleted Successfully...",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }, (err: Error) => {
        console.log("error : ", err.message);
        let toast = this.toastCtrl.create({
          message: "Error in Deleting Leave, Please Try again later.",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      })
  }
  EditAppLeaves(item) {
    this.navCtrl.push(LeaveEditPage, item);
  }
  DeleteAppLeaves(itemId) {
    this.CancelVMObj.RequestId = itemId;
    this.LeaveServices.CancelAppLeave(this.CancelVMObj).subscribe((data) => {
      console.log(data);
      if (data.length == 0) {
        LeaveListPage.motherArr.forEach((ele) => {
          if (ele.Id == itemId) {
            ele.ApprovalStatus = 8;
            return;
          }
        })
        this.Leaves_Arr = _.chain(LeaveListPage.motherArr).groupBy('Type').toPairs()
          .map(ele => _.zipObject(['divisionType', 'divisionTypes'], ele)).value();
      }
      let toast = this.toastCtrl.create({
        message: "Leave Is cancelled Successfully...",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, (e: Error) => {
      console.log(e.message);
      let toast = this.toastCtrl.create({
        message: "Error in Cancelling Leave, Please Try again later.",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    })

  }
  CutAppLeaves(item) {
    this.navCtrl.push(CutLeavePage,item);
  }
}
