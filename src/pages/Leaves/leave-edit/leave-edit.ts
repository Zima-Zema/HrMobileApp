import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IValidationMsg, IValidate, IRequestData, LeaveServicesApi, IEdit } from '../../../shared/LeavesService';
import { LeaveListPage } from '../leave-list/leave-list';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from '../../../shared/IUser';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-leave-edit',
  templateUrl: 'leave-edit.html',
})
export class LeaveEditPage {
  comingLeave: any;

  //ngModel
  public actualStartDate: any;
  public actualNOfDays: any;
  public actualReturnDate: any;
  public actualEndDate: any;

  //
  //object to transmit
  errorMsgObj: IValidationMsg = {
    AssignError: null,
    DeptPercentError: null,
    HasRequestError: null,
    IsError: false,
    IsReplacementError: null,
    percentage: null,
    ReplacmentError: null,
    Stars: 0,
    StarsError: null,
    WaitingError: null,
    WaitingMonth: null,
    AllowedDaysError:null,
    CantGreaterError:null,
    PeriodError:null
  }
  //
  validateObj: IValidate = {
    Id: 0,
    TypeId: 0,
    CompanyId: 0,
    Culture: "",
    EmpId: 0,
    EndDate: "",
    StartDate: null,
    ReplaceEmpId: 0,
    NofDays:0,
  }
  //
  RequestDataObj: IRequestData = {
    CompanyId: 0,
    TypeId: 0,
    Culture: "",
    EmpId: 0,
    RequestId: 0,
    StartDate: ""
  }
  editObj: IEdit = {
    EditedStartDate: null,
    EditedEndDate: null,
    EditedReturnDate: null,
    CompanyId: 0,
    Language: "",
    RequestId: 0
  }

  ////
  //utilits
  public pickFormat: any;
  public displayFormat: any;
  public calender: any;
  public leaveType: any;
  public filteredArr;
  public localDateval;
  public minDate = new Date();

  public rate;
  //
  public EditLeaveForm: FormGroup;

  //Loader
  public LoadingCons = this.loadingCtrl.create({
    spinner: 'dots'
  });
  //Toaster
  public ErrorMsgToast = this.toastCtrl.create({
    //message: "There Is Error, Please Try Again Later...",
    message: "",
    duration: 3000,
    position: 'middle'
  });
  //
  user: IUser;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private translationService: TranslateService) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.RequestDataObj.CompanyId = this.editObj.CompanyId = this.user.CompanyId;
        this.RequestDataObj.Culture = this.user.Culture;
        this.RequestDataObj.EmpId = this.user.EmpId;
        this.editObj.Language = this.user.Language;
      }
    });

    this.comingLeave = this.navParams.data;
    this.actualNOfDays = this.comingLeave.NofDays;

    this.EditLeaveForm = this.formBuilder.group({
      actualStartDate: ['', Validators.required],
      actualNOfDays: [''],
      actualEndDate: [''],
      actualReturnDate: ['']

    });
    this.errorMsgObj.IsError = false;
    //
    this.pickFormat = 'MMM DD YYYY';
    this.displayFormat = "MMM DD, YYYY ";
    //
    this.RequestDataObj.TypeId = this.comingLeave.TypeId;
    this.RequestDataObj.StartDate = new Date(this.comingLeave.StartDate).toDateString();
    this.LoadingCons.present().then(() => {

      var a: any = {};
      this.translationService.get('ErrorToasterMsg').subscribe((data) => {
        a.message = data;
      })

      this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
        this.calender = data.Calender;
        this.leaveType = data.LeaveType;
        this.filteredArr = this.LeaveServices.getOffDays(data.Calender);
        this.localDateval = new Date();
        this.localDateval = this.LeaveServices.getInitialDate(this.localDateval, data.Calender);
        this.LoadingCons.dismiss();
      }, (e) => {
        this.LoadingCons.dismiss().then(() => {
          this.ErrorMsgToast.setMessage(a.message);
          this.ErrorMsgToast.present();
        })
      });
    });//loader
  }

  //
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
  ionViewDidLoad() {
  }

  dateChange(newStartDate) {
    console.log(newStartDate)
    this.actualStartDate = this.bloodyIsoString(new Date(new Date(newStartDate).toDateString())).slice(0, -15);
    this.bindForm();

  }
  bindForm() {
    console.log("insideBindForm",this.actualStartDate)
    var a: any = {};
    this.translationService.get('ErrorToasterMsg').subscribe((data) => {
      a.message = data;
    })
    //Loader
    let LoadingValidate = this.loadingCtrl.create({
      spinner: 'dots'
    });
    //
    if (this.actualStartDate) {
      let res = this.LeaveServices.calcDates(this.actualStartDate, this.actualNOfDays, this.calender, this.leaveType, 0);
      this.actualEndDate = new Date(res.endDate).toISOString();
      this.actualReturnDate = new Date(res.returnDate).toISOString();
      this.validateObj.Id = this.comingLeave.Id ? this.comingLeave.Id : 0;
      this.validateObj.CompanyId = this.user.CompanyId;
      this.validateObj.Culture = this.user.Culture;
      this.validateObj.EmpId = this.user.EmpId;
      this.validateObj.EndDate = new Date(new Date(this.actualEndDate).toString()).toISOString().slice(0, -1);
      this.validateObj.StartDate = new Date(new Date(this.actualStartDate).toString()).toISOString().slice(0, -1);
      this.validateObj.ReplaceEmpId = this.comingLeave.ReplaceEmpId;
      this.validateObj.TypeId = this.comingLeave.TypeId;

      this.validateObj.NofDays = (this.actualNOfDays == null) ? 0 : Number.parseInt(this.actualNOfDays);
        this.validateObj.NofDays = isNaN(this.validateObj.NofDays) ? 0 : this.validateObj.NofDays

      if (this.actualEndDate) {
        LoadingValidate.present().then(() => {
          console.log("Out validateRequest")
          this.LeaveServices.validateRequest(this.validateObj).subscribe((data) => {
            this.errorMsgObj = null;
            this.errorMsgObj = data;
            this.rate = this.errorMsgObj.Stars;
            console.log("In validateRequest")
            LoadingValidate.dismiss();
          }, (e) => {
            LoadingValidate.dismiss().then(() => {
              this.ErrorMsgToast.setMessage(a.message);
              this.ErrorMsgToast.present();
            })
          })
        });//Loader
      }
    }
  }

  UpdateLeaves() {
    var a: any = {};
    this.translationService.get('ErrorToasterMsg').subscribe((data) => {
      a.message = data;
    })
    //Loader
    let LoadingApprov = this.loadingCtrl.create({
      spinner: 'dots'
    });
    //
    this.editObj.EditedStartDate = new Date(this.actualStartDate).toLocaleDateString();
    this.editObj.EditedEndDate = new Date(this.actualEndDate).toLocaleDateString();
    this.editObj.EditedReturnDate = new Date(this.actualReturnDate).toLocaleDateString();
    this.editObj.RequestId = this.comingLeave.Id;
    LoadingApprov.present().then(() => {
      this.LeaveServices.editApprovedLeave(this.editObj).subscribe((data) => {
        LeaveListPage.motherArr = LeaveListPage.motherArr.filter((ele) => ele.Id !== this.comingLeave.Id);
        this.comingLeave.ActualStartDate = this.actualStartDate;// start date does not chang on server
        this.comingLeave.ActualEndDate = this.actualEndDate;
        this.comingLeave.EndDate = this.actualEndDate;
        LeaveListPage.motherArr.push(this.comingLeave);

        this.navCtrl.pop();
        LoadingApprov.dismiss()
      }, (error) => {
        LoadingApprov.dismiss().then(() => {
          this.ErrorMsgToast.setMessage(a.message);
          this.ErrorMsgToast.present();
        })
      });
    })
  }
}