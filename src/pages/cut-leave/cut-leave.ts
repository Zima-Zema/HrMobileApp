import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { LeaveServicesApi, IRequestData, IBreak } from "../../shared/LeavesService"
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { LeaveListPage } from '../leave-list/leave-list';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from '../../shared/IUser';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-cut-leave',
  templateUrl: 'cut-leave.html',
})

export class CutLeavePage {
  public LeaveComing: any;
  CutLeaveForm: FormGroup;
  //
  public ReturnDate: any;

  public startDate: any;
  public endDate: any;
  public noFDays: any;
  public calender: any;
  public leaveType: any;
  public BalBefore: any;
  public minDate = new Date();
  public filteredArr;
  public localDateval = new Date();
  public pickFormat: any;
  public displayFormat: any;
  public ActualendDate: any;
  public NofDaysAfter: number;
  public balAfter: number;

  RequestDataObj: IRequestData = {
    CompanyId: 0,
    TypeId: 0,
    Culture: "",
    EmpId: 0,
    RequestId: 0,
    StartDate: ""
  }
  breakObj: IBreak = {
    BreakEndDate: null,
    BreakNofDays: 0,
    CompanyId: 0,
    Language: "",
    RequestId: 0
  }
  user: IUser;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder,
    private ToastCtrl: ToastController,
    private LoadingCtrl: LoadingController,
    private storage: Storage,
    private translationService: TranslateService) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.RequestDataObj.CompanyId = this.user.CompanyId;
        this.RequestDataObj.Culture = this.user.Culture;
        this.RequestDataObj.EmpId = this.user.EmpId;
        this.breakObj.CompanyId = this.user.CompanyId;
        this.breakObj.Language = this.user.Language;

      }
    });
    //Loader
    let RequestLoader = this.LoadingCtrl.create({
      spinner: 'dots'
    })
    //Toaster
    let RequestErrorToast = this.ToastCtrl.create({
      message: "There Is Error, Please Try Again Later...",
      duration: 2000,
      position: 'middle'
    });
    //
    this.LeaveComing = this.navParams.data;
    console.log("LeaveComing : ", this.LeaveComing)
    //
    console.log("coming Data : ", this.LeaveComing);
    this.startDate = this.LeaveComing.StartDate;
    this.noFDays = this.LeaveComing.NofDays;
    this.endDate = this.LeaveComing.EndDate;
    this.ReturnDate = this.LeaveComing.ReturnDate;
    //
    this.CutLeaveForm = this.formBuilder.group({
      ReturnDate: ['', Validators.required],
      ActualendDate: [''],
      NofDaysAfter: [''],
      balAfter: ['']
    });
    //
    this.pickFormat = 'MMM DD YYYY';
    this.displayFormat = "MMM DD, YYYY ";
    //
    this.RequestDataObj.TypeId = this.LeaveComing.TypeId;
    this.RequestDataObj.StartDate = new Date(this.LeaveComing.StartDate).toDateString();
    RequestLoader.present().then(() => {
      this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
        console.log("GetRequestLeaveData : ", data)
        this.calender = data.Calender;
        this.leaveType = data.LeaveType;
        this.BalBefore = data.requestVal.BalBefore;
        this.filteredArr = this.LeaveServices.getOffDays(data.Calender);
        this.localDateval = new Date();
        this.localDateval = this.LeaveServices.getInitialDate(this.localDateval, data.Calender);
        RequestLoader.dismiss();
      }, (e: Error) => {
        RequestLoader.dismiss().then(() => {
          RequestErrorToast.present();
        });
      });
    });//loader
  }

  bloodyIsoString(bloodyDate: Date) {
    let tzo = -bloodyDate.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num) {
        let norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return bloodyDate.getFullYear() +
      '-' + pad(bloodyDate.getMonth() + 1) +
      '-' + pad(bloodyDate.getDate()) +
      'T' + pad(bloodyDate.getHours()) +
      ':' + pad(bloodyDate.getMinutes()) +
      ':' + pad(bloodyDate.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }

  dateChange(item) {
    console.log(` dateChange item : ${item}`)
    if (item) {
      this.ReturnDate = this.bloodyIsoString(new Date(new Date(item).toDateString())).slice(0, -15);
      //console.log("dateChange", this.ReturnDate);
      let res = this.LeaveServices.cutLeave(this.startDate, this.ReturnDate, this.noFDays, this.endDate, this.calender, this.leaveType, this.BalBefore);
      console.log("dateChange res : ", res)
      this.ActualendDate = new Date(res.endDate).toISOString();
      this.NofDaysAfter = res.noFDays;
      this.balAfter = res.balance;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CutLeavePage');
  }

  CutLeaves() {
    //Loader
    let CutLoader = this.LoadingCtrl.create({
      content: "Cutting Leave..."
    })
    //Toaster
    let CutErrorToast = this.ToastCtrl.create({
      message: "Error in cutting this leave , please try again later.",
      duration: 3000,
      position: 'middle'
    });
    let CutSuccessToast = this.ToastCtrl.create({
      message: "Success to cut this Leave.",
      duration: 2000,
      position: 'bottom'
    })
    //
    this.breakObj.CompanyId = this.user.CompanyId;
    this.breakObj.Language = this.user.Language;
    this.breakObj.RequestId = this.LeaveComing.Id;
    this.breakObj.BreakEndDate = new Date(new Date(this.ActualendDate).toString()).toISOString().slice(0, -1); //new Date(this.ActualendDate).toLocaleDateString();
    this.breakObj.BreakNofDays = this.NofDaysAfter;
    //
    CutLoader.present().then(() => {
      this.LeaveServices.breakLeave(this.breakObj).subscribe((data) => {
        if (data.length) {
          CutLoader.dismiss().then(() => {
            CutErrorToast.present();
          })
        }
        else {
          LeaveListPage.motherArr = LeaveListPage.motherArr.filter((ele) => ele.Id !== this.LeaveComing.Id);
          this.LeaveComing.ActualEndDate = this.breakObj.BreakEndDate;
          this.LeaveComing.EndDate = this.breakObj.BreakEndDate;
          this.LeaveComing.NofDays = this.breakObj.BreakNofDays;
          //this.breakObj.RequestId;
          LeaveListPage.motherArr.push(this.LeaveComing);
          console.log("mother Array : ", LeaveListPage.motherArr);
          console.log("breakObj : ", this.breakObj)
          this.navCtrl.pop();
          CutLoader.dismiss().then(() => {
            CutSuccessToast.present();
          })
        }
      }, (e) => {
        CutLoader.dismiss().then(() => {
          CutErrorToast.present();
        })
      })
    }); // Cut Loader
    console.log("Cut: ", this.breakObj);
  }

}
