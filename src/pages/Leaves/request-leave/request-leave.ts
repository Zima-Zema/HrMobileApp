import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { LeaveServicesApi, IRequestType, IRequestData, ILeaveRequest, ApprovalStatusEnum, IValidate, IValidationMsg } from '../../../shared/LeavesService';
import { LeaveListPage } from '../leave-list/leave-list';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { DatePickerDirective } from 'ion-datepicker';
import { IUser } from '../../../shared/IUser';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { TranslateUtilities } from '../../../shared/TranslateUtilities';
import { WelcomePage } from '../../welcome/welcome'
@IonicPage()
@Component({
  selector: 'page-request-leave',
  templateUrl: 'request-leave.html',
})
export class RequestLeavePage {

  tabBarElement: any;

  filteredArr;
  localDateval = new Date();
  public item: any;

  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;

  public closeDatepicker() {
    this.datepickerDirective.modal.dismiss();
  }

  doughnutChart: any;
  barChart: any;
  public EditFlag: number = 0;
  public EnableLoaderFlag: boolean = false;
  public BtnTxt: string = "Submit";
  public YearsArr: Array<number> = [];
  public yearsValue: Array<number> = [];
  // public disableFlagFarc: boolean = true;
  // public disableFlagNoOfDays: boolean = true;
  // public disableStartDate: boolean = true;
  //Form ngModel
  public leaveType: any;
  public startDate: any;
  public noOfDays: any;
  public allowedDays: number = undefined;
  public reservedDays: number = undefined;
  public returnDate: any;
  public endDate: any;
  public balBefore: number = undefined;
  public balAfter: number = undefined;
  public replacement: any;
  public comments: any;
  public reason: any;
  public fraction: any;
  //
  public minDate: any;
  public rate: number = 0;
  public RequestLeaveForm: FormGroup;
  public LeavesData: Array<any> = [];
  public ChartData: Array<any> = [];
  public LeaveReasonList: Array<any> = [];
  public Replacements: Array<any> = [];
  public requestData: any;
  public workhour: number;
  allowFraction: boolean = false;
  static maxDays: number = null;
  static allowed: number = null;

  static ZNError: string = null;
  static BTMaxError: string = null;
  static BTAllowError: string = null;
  static NanError: string = null;
  static NanWError: string = null;
  static RequireError: string = null;
  static DayFracError: string = null;
  static ReasonError: string = null;
  public lang;
  public static frac: number = 0;
  public static FullData: any = null;
  public static mustReason: boolean = true;
  public static mustNoOfDays: number = null;
  pickFormat: string;
  displayFormat: string;
  public errorArray: Array<string> = [];

  RequestTypeObj: IRequestType = {
    CompId: 0,
    Culture: "",
    EmpId: 0
  }
  RequestDataObj: IRequestData = {
    CompanyId: 0,
    TypeId: 0,
    Culture: "",
    EmpId: 0,
    RequestId: 0,
    StartDate: ""
  }
  requestObj: ILeaveRequest = {
    Id: 0,
    TypeId: 0,
    ReqReason: 0,
    BalBefore: 0,
    BalanceBefore: 0,
    submit: true,
    CompanyId: 0,
    EmpId: 0,
    ReplaceEmpId: 0,
    NofDays: 0,
    DayFraction: 0,
    StartDate: null,
    Culture: "",
    EndDate: "",
    ReturnDate: "",
    ReasonDesc: "",
    Type: "",
    ApprovalStatus: ApprovalStatusEnum.Draft
  }
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
    CantGreaterError:null
  }
  //Loader
  public LoadingChart = this.loadingCtrl.create({
    spinner: 'dots'
  });
  //Toaster
  public ErrorMsgToast = this.ToastCtrl.create({
    message: "There Is Error, Please Try Again Later...",
    duration: 2000,
    position: 'middle'
  });
  //
  user: IUser;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private ToastCtrl: ToastController,
    private storage: Storage,
    private translateUtilities: TranslateService) {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tarnlateErrors();
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.RequestTypeObj.CompId = this.RequestDataObj.CompanyId = this.user.CompanyId;
        this.RequestTypeObj.Culture = this.RequestDataObj.Culture = this.user.Culture;
        this.RequestTypeObj.EmpId = this.RequestDataObj.EmpId = this.user.EmpId;
      }
    });

    this.lang = translateUtilities.getDefaultLang();

    //Edit Mode
    this.item = this.navParams.data;
    this.errorMsgObj.IsError = false
    //form validation
    this.RequestLeaveForm = this.formBuilder.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      noOfDays: [''],
      allowedDays: [''],
      reservedDays: [''],
      endDate: [''],
      returnDate: [''],
      balBefore: [''],
      balAfter: [''],
      replacement: [''],
      comments: [''],
      reason: ['', Validators.compose([RequestLeavePage.isValidReqReason])],
      fraction: ['']

    });

    this.LoadingChart.present().then(() => {
      this.LeaveServices.GetLeaveTypes(this.RequestTypeObj).subscribe((Konafa) => {
        this.LeavesData = Konafa.LeaveTypeList;
        this.ChartData = Konafa.ChartData;
        this.Replacements = Konafa.Replacements;
        this.LeaveReasonList = Konafa.LeaveReasonList;
        this.loadCharts(this.ChartData);
        this.LoadingChart.dismiss();
      }, (e) => {
        this.LoadingChart.dismiss().then(() => {
          this.ErrorMsgToast.present();
        })
      })
    });//loader
    this.yearsValue = this.GetYears();
  }
  tarnlateErrors() {
    this.translateUtilities.get('ZNError').subscribe(translation => {
      RequestLeavePage.ZNError = translation;
    });
    this.translateUtilities.get('BTMaxError').subscribe(translation => {
      RequestLeavePage.BTMaxError;
    });
    this.translateUtilities.get('BTAllowError').subscribe(translation => {
      RequestLeavePage.BTAllowError = translation;
    });
    this.translateUtilities.get('NanError').subscribe(translation => {
      RequestLeavePage.NanError = translation;
    });
    this.translateUtilities.get('NanWError').subscribe(translation => {
      RequestLeavePage.NanWError = translation;
    });
    this.translateUtilities.get('RequireError').subscribe(translation => {
      RequestLeavePage.RequireError = translation;
    });
    this.translateUtilities.get('DayFracError').subscribe(translation => {
      RequestLeavePage.DayFracError = translation;
    });
    this.translateUtilities.get('ReasonError').subscribe(translation => {
      RequestLeavePage.ReasonError = translation;
    });
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
  // // EditFlag = 0 ---> Request  , EditFlag = 1 ---> Edit , EditFlad = 2 --->show
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    if (Object.keys(this.item).length > 0) {
      //Edit Mode
      if (this.item.readOnly == false) {
        this.EnableLoaderFlag = true;

        this.EditFlag = 1;
        this.BtnTxt = "Update";
        this.leaveType = this.item.TypeId
        this.leaveChange(this.item.TypeId);
        this.leaveType = this.item.TypeId;

        let SDate = new Date(this.item.StartDate);
        this.startDate = this.bloodyIsoString(new Date(new Date(this.item.StartDate).toDateString())).slice(0, -15);
        this.minDate = this.bloodyIsoString(SDate);
        this.noOfDays = this.item.NofDays;

        this.replacement = this.item.ReplaceEmpId;
        this.comments = this.item.ReasonDesc;
        this.reason = this.item.ReqReason;
        this.endDate = this.bloodyIsoString(new Date(new Date(this.item.EndDate).toDateString())).slice(0, -15);
        this.returnDate = this.bloodyIsoString(new Date(new Date(this.item.ReturnDate).toDateString())).slice(0, -15);
        this.fraction = this.item.DayFraction;

      }
      //Show Mode
      else {

        this.EditFlag = 2;
        this.BtnTxt = "Update";
        this.noOfDays = this.item.NofDays;
        this.fraction = this.item.DayFraction;
        this.leaveChange(this.item.TypeId);
        this.leaveType = this.item.TypeId;
        let SDate = new Date(this.item.StartDate);
        this.startDate = this.bloodyIsoString(new Date(new Date(this.item.StartDate).toDateString())).slice(0, -15);
        this.minDate = this.bloodyIsoString(SDate);
        this.noOfDays = this.item.NofDays;
        // this.returnDate = this.bloodyIsoString(new Date(new Date(this.item.ReturnDate).toDateString())).slice(0, -15);
        // this.endDate = this.bloodyIsoString(new Date(new Date(this.item.EndDate).toDateString())).slice(0, -15);
        this.replacement = this.item.ReplaceEmpId;
        this.comments = this.item.ReasonDesc;
        this.reason = this.item.ReqReason;
        this.endDate = this.bloodyIsoString(new Date(new Date(this.item.EndDate).toDateString())).slice(0, -15);
        this.returnDate = this.bloodyIsoString(new Date(new Date(this.item.ReturnDate).toDateString())).slice(0, -15);

      }
    }
    //Request Mode
    else {
      this.EditFlag = 0;
      this.BtnTxt = "Submit";
      this.minDate = this.bloodyIsoString(new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0)));
    }
  }

  ionViewDidEnter() {
    if (this.EditFlag == 0) {

      this.RequestLeaveForm.controls['noOfDays'].disable();
      this.RequestLeaveForm.controls['startDate'].disable();
      this.RequestLeaveForm.controls['fraction'].disable();
    }
    else if (this.EditFlag == 1 && (this.RequestLeaveForm.controls['noOfDays'].value != 0 || this.RequestLeaveForm.controls['noOfDays'].value != "")) {
      if (this.RequestLeaveForm.controls['noOfDays'].value >= 1) {

        this.RequestLeaveForm.controls['noOfDays'].enable();
        this.RequestLeaveForm.controls['startDate'].enable();
        this.RequestLeaveForm.controls['fraction'].disable();
      }
      else if (this.RequestLeaveForm.controls['noOfDays'].value < 1) {

        this.RequestLeaveForm.controls['noOfDays'].disable();
        this.RequestLeaveForm.controls['startDate'].enable();
        this.RequestLeaveForm.controls['fraction'].enable();
      }
    }
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
  GetYears() {
    let year = new Date().getFullYear();
    for (let i = year; i <= year + 100; i++) {
      this.YearsArr.push(i);
    }
    return this.YearsArr;
  }
  loadCharts(chartData: Array<any>) {
    let lableTemp: Array<string> = [];
    let dataTemp: Array<number> = [];
    let DaysTemp: Array<number> = [];
    chartData.forEach((item) => {
      lableTemp.push(item.Name);
      dataTemp.push(item.Balance);
      DaysTemp.push(item.Days)
    })
    // //doughnut chart
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: lableTemp,
        datasets: [{
          label: '# of Votes',
          data: dataTemp,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(205, 92, 92 , 0.2)',
            'rgba(128, 128, 0 , 0.2)',
            'rgba(41, 56, 185 ,0.2)',
            'rgba(91, 44, 111 , 0.2)',
            'rgba(26, 115, 50 ,0.2)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#27AE60",
            "#7B68EE",
            "#F39C12",
            "#CD5C5C",
            "#808000",
            "#2938B9",
            "#5B2C6F",
            "#1A7332"
          ]
        }]
      }
    });
    // //Bar Chart
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: lableTemp,
        datasets: [
          {
            label: "Balance",
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            hoverBackgroundColor: "#7B68EE",
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            data: dataTemp
          }, {
            label: "Days",
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            hoverBackgroundColor: "#FFCE56",
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            data: DaysTemp
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });
  }
  // events
  public chartClicked(e: any): void {

  }
  public chartHovered(e: any): void {

  }
  value(item) {

  }
  ////////////////////////
  leaveChange(item: any) {
    //Loader
    let LoadingLeaves = this.loadingCtrl.create({ spinner: 'dots' });
    //this.disableStartDate=false;
    this.RequestLeaveForm.controls['startDate'].enable();
    this.resetForm();

    this.RequestDataObj.TypeId = item;
    this.RequestDataObj.StartDate = new Date().toDateString();

    LoadingLeaves.present().then(() => {
      this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {

        this.workhour = data.Calender.WorkHours;
        this.filteredArr = this.LeaveServices.getOffDays(data.Calender);
        this.requestData = data;
        this.allowedDays = data.requestVal.AllowedDays;
        RequestLeavePage.FullData = data.LeaveType.AllowFraction;
        this.allowFraction = data.LeaveType.AllowFraction;
        RequestLeavePage.maxDays = data.requestVal.MaxDays;
        RequestLeavePage.allowed = data.requestVal.AllowedDays;
        RequestLeavePage.mustReason = data.LeaveType.MustAddCause;
        if (RequestLeavePage.mustReason == true) {
          if (this.EditFlag == 0) { //Request Mode -- > set ddl to 0
            this.RequestLeaveForm.controls['reason'].setValue(0);
          }
          this.RequestLeaveForm.controls['reason'].markAsDirty({ onlySelf: true });
        }

        //
        if (!RequestLeavePage.FullData && this.EditFlag != 2) {

          this.RequestLeaveForm.controls['noOfDays'].setValidators([RequestLeavePage.isDaysRequired, RequestLeavePage.isRequired]);
          this.RequestLeaveForm.controls['noOfDays'].updateValueAndValidity();
          this.RequestLeaveForm.controls['noOfDays'].markAsDirty({ onlySelf: true });
        }
        else if (RequestLeavePage.FullData && this.EditFlag != 2) {

          this.RequestLeaveForm.controls['noOfDays'].setValidators([RequestLeavePage.isDaysRequired, RequestLeavePage.isRequired]);
          this.RequestLeaveForm.controls['noOfDays'].updateValueAndValidity(); //call
          this.RequestLeaveForm.controls['fraction'].setValidators(RequestLeavePage.isDaysRequired);
          this.RequestLeaveForm.controls['fraction'].updateValueAndValidity(); //call
          this.RequestLeaveForm.controls['noOfDays'].markAsDirty({ onlySelf: true });
          this.RequestLeaveForm.controls['fraction'].markAsDirty({ onlySelf: true });
        }
        //
        if (!this.allowFraction) {
          this.fraction = undefined;
          this.pickFormat = 'MMM DD YYYY';
          this.displayFormat = "MMM DD, YYYY"
        }
        else { //العارضه
          this.pickFormat = 'MMM DD YYYY';
          this.displayFormat = "MMM DD, YYYY";
        }
        //
        if (data.LeaveType.AbsenceType == 8) {
          this.minDate = new Date();
          this.localDateval = new Date();
          this.localDateval = this.LeaveServices.getInitialDate(this.localDateval, data.Calender);
        }
        else {
          this.minDate = new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
          this.localDateval = new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
          this.localDateval = this.LeaveServices.getInitialDate(this.localDateval, data.Calender);
        }
        this.reservedDays = data.requestVal.ReservedDays
        this.balBefore = data.requestVal.BalBefore;
        if (this.EditFlag == 1 || this.EditFlag == 2) {
          if (this.noOfDays % 1 === 0) {
            this.fraction = 0;
            this.noOfDays = this.noOfDays;
            this.balAfter = this.calcBalAfter(this.balBefore, this.noOfDays, this.fraction); //this.balBefore - (Number.parseFloat(this.noOfDays) + (this.fraction ? this.fraction : 0));
          }
          else {
            this.noOfDays = 0;
            this.fraction = this.item.DayFraction;
            this.balAfter = this.calcBalAfter(this.balBefore, this.noOfDays, this.fraction);
          }
          this.bindForm();
        }
        else {
          this.balAfter = undefined;
        }
        LoadingLeaves.dismiss();
      }, (err) => {
        LoadingLeaves.dismiss().then(() => {
          this.ErrorMsgToast.present();
        })
      });
    });//loader
  }
  dateChange(item) {
    //this.ResetMiniForm();

    if (item) {
      if (this.EditFlag != 2) {

        if ((this.RequestLeaveForm.controls['noOfDays'].value == null || this.RequestLeaveForm.controls['noOfDays'].value == 0) && (this.RequestLeaveForm.controls['fraction'].value == 0 || this.RequestLeaveForm.controls['fraction'].value == null)) {

          this.RequestLeaveForm.controls['noOfDays'].enable();
          this.RequestLeaveForm.controls['fraction'].enable();
        }
        else if (this.RequestLeaveForm.controls['noOfDays'].value != null || this.RequestLeaveForm.controls['noOfDays'].value != 0) {

          this.RequestLeaveForm.controls['noOfDays'].enable();
          this.RequestLeaveForm.controls['fraction'].disable();
        }
        else if (this.RequestLeaveForm.controls['fraction'].value != 0 || this.RequestLeaveForm.controls['fraction'].value != null) {

          this.RequestLeaveForm.controls['noOfDays'].disable();
          this.RequestLeaveForm.controls['fraction'].enable();
        }

      }
      this.startDate = this.bloodyIsoString(new Date(new Date(item).toDateString())).slice(0, -15);

      this.bindForm();
    }
  }
  //
  replacementChange(replacement) {

    //Loader
    let LoadingValidate = this.loadingCtrl.create({ spinner: 'dots' });
    //


    if (this.EditFlag != 2 && this.EnableLoaderFlag == false) {

      if (this.endDate) {
        this.validateObj.Id = this.item.Id ? this.item.Id : 0;
        this.validateObj.CompanyId = this.user.CompanyId;
        this.validateObj.Culture = this.user.Culture;
        this.validateObj.EmpId = this.user.EmpId;
        this.validateObj.EndDate = new Date(new Date(this.endDate).toString()).toISOString().slice(0, -1);
        this.validateObj.StartDate = new Date(new Date(this.startDate).toString()).toISOString().slice(0, -1);
        this.validateObj.ReplaceEmpId = replacement;
        this.validateObj.TypeId = this.leaveType;
        this.validateObj.NofDays=this.noOfDays;

        LoadingValidate.present().then(() => {
          this.LeaveServices.validateRequest(this.validateObj).subscribe((data) => {
            this.errorMsgObj = null;
            this.errorMsgObj = data;
            this.rate = this.errorMsgObj.Stars;

            LoadingValidate.dismiss();
          }, (e) => {
            LoadingValidate.dismiss().then(() => {
              this.ErrorMsgToast.present();
            })
          })
        });//loader      
      }
    }
    this.EnableLoaderFlag = false;
  }
  //
  numberChange(item) {

    if (this.EditFlag != 2) {
      if (item > 0 || item < 0) {
        this.RequestLeaveForm.controls['fraction'].disable();
        this.RequestLeaveForm.controls['fraction'].clearValidators();
      }
      else if (item == "" || item == 0) {
        this.RequestLeaveForm.controls['fraction'].enable();
        this.RequestLeaveForm.controls['fraction'].setValidators(RequestLeavePage.isDaysRequired);
        this.RequestLeaveForm.controls['fraction'].updateValueAndValidity();
        this.RequestLeaveForm.controls['fraction'].markAsDirty({ onlySelf: true });
      }
    }
    this.bindForm();
  }
  //
  fractionChange(item: number) {
    this.fraction = item;
    if (item) {
      if (this.EditFlag != 2) {
        if (item == 0) {
          this.RequestLeaveForm.controls['noOfDays'].enable();
          this.RequestLeaveForm.controls['noOfDays'].setValidators([RequestLeavePage.isDaysRequired, RequestLeavePage.isRequired]);
          this.RequestLeaveForm.controls['noOfDays'].updateValueAndValidity();
          this.RequestLeaveForm.controls['noOfDays'].markAsDirty({ onlySelf: true });
        }
        else {
          this.RequestLeaveForm.controls['noOfDays'].disable();
          this.RequestLeaveForm.controls['noOfDays'].clearValidators();
        }
      }
      RequestLeavePage.frac = item;
      this.fraction = item;
    }
    else {
      RequestLeavePage.frac = 0
      //this.fraction = 0;
    }

    this.bindForm();
  }
  reasonChange(reason) {
  }

  calcBalAfter(balBefore, NofDays, Fraction) {

    Fraction = Number.parseInt(Fraction);
    NofDays = Number.parseInt(NofDays);
    let balAfter = 0;
    if (NofDays && NofDays > 0) {
      NofDays = Number.parseInt(NofDays);
      balAfter = balBefore - NofDays;
      return balAfter;
    }
    else {

      NofDays = 0;
      if (Fraction > 0) {

        switch (Fraction) {

          case 1: Fraction = 0.25;
            break;
          case 3: Fraction = 0.25;
            break;
          case 2: Fraction = 0.50;
            break;
          case 4: Fraction = 0.50;
            break;
          default:
            Fraction = 0;
            break;
        }

        balAfter = Number.parseFloat(balBefore) - Number.parseFloat(Fraction);

        return balAfter;
      }
      return balAfter;
    }
  }

  bindForm() {

    //Loader
    let Loadingrequest = this.loadingCtrl.create({ spinner: 'dots' });

    if (this.startDate && (this.noOfDays || this.fraction)) {
      let res = this.LeaveServices.calcDates(this.startDate, this.noOfDays, this.requestData.Calender, this.requestData.LeaveType, this.fraction);

      this.endDate = this.allowFraction ? new Date(res.endDate).toISOString() : new Date(res.endDate).toISOString();

      this.returnDate = this.allowFraction ? new Date(res.returnDate).toISOString() : new Date(res.returnDate).toISOString();
      this.startDate = this.allowFraction ? new Date(res.startDate).toISOString() : new Date(res.startDate).toISOString();


      this.balAfter = this.calcBalAfter(this.balBefore, this.noOfDays, this.fraction);



      if (this.EditFlag != 2 && this.EnableLoaderFlag == false) {
        this.validateObj.Id = this.item.Id ? this.item.Id : 0;
        this.validateObj.CompanyId = this.user.CompanyId;
        this.validateObj.Culture = this.user.Culture;
        this.validateObj.EmpId = this.user.EmpId;
        this.validateObj.EndDate = new Date(new Date(this.endDate).toString()).toLocaleDateString();//.slice(0, -1);
        this.validateObj.StartDate = new Date(new Date(this.startDate).toString()).toLocaleDateString();//.slice(0, -1);
        this.validateObj.ReplaceEmpId = this.replacement;
        this.validateObj.TypeId = this.leaveType;
        this.validateObj.NofDays=this.noOfDays;
        if (this.endDate) {
          Loadingrequest.present().then(() => {
            this.LeaveServices.validateRequest(this.validateObj).subscribe((data) => {
              this.errorMsgObj = null;
              this.errorMsgObj = data;
              this.rate = this.errorMsgObj.Stars;

              Loadingrequest.dismiss();
            }, (e) => {
              Loadingrequest.dismiss().then(() => {
                this.ErrorMsgToast.present();
              })
            })
          });//Loader
        }
      }
      this.EnableLoaderFlag = false;
    }
  }
  resetForm() {
    //this.errorMsgObj = null;
    RequestLeavePage.allowed = null;
    RequestLeavePage.maxDays = null;
    RequestLeavePage.FullData = null;
    RequestLeavePage.frac = 0;
    this.startDate = null;
    this.noOfDays = null;
    this.allowedDays = undefined;
    this.reservedDays = undefined;
    this.returnDate = null;
    this.endDate = null;
    this.balBefore = undefined;
    this.balAfter = undefined;
    this.replacement = null;;
    this.comments = null;;
    this.reason = null;;
    this.fraction = null;;
  }

  ResetMiniForm() {
    RequestLeavePage.allowed = null;
    RequestLeavePage.maxDays = null;
    RequestLeavePage.FullData = null;
    RequestLeavePage.frac = 0;
    this.noOfDays = null;
    this.allowedDays = undefined;
    this.reservedDays = undefined;
    this.returnDate = null;
    this.endDate = null;
    this.balBefore = undefined;
    this.balAfter = undefined;
    this.replacement = null;
    this.comments = null;
    this.reason = null;
    this.fraction = null;
  }


  static isRequired(control: FormControl) {

    let x = Number.parseInt(control.value)
    if (x < 0) {

      return {
        "general": RequestLeavePage.ZNError

      }
    }
    if (x > RequestLeavePage.maxDays && RequestLeavePage.maxDays != null) {
      return {
        "maximum": RequestLeavePage.BTMaxError
      }
    }
    if (control.value > RequestLeavePage.allowed) {
      return {
        "allowed": RequestLeavePage.BTAllowError
      };
    }
    if (isNaN(control.value)) {
      return {
        "general": RequestLeavePage.NanError
      };
    }
    if (control.value % 1 !== 0) {
      return {
        "general": RequestLeavePage.NanWError
      };
    }
    else {
      return null;
    }

  }

  static isDaysRequired(control: FormControl) {


    if (RequestLeavePage.FullData == false && (control.value == null || control.value == "")) {

      return {
        'RequiredDays': RequestLeavePage.RequireError
      }
    }
    else if (RequestLeavePage.FullData == true && (control.value == null || control.value == "" || control.value == 0)) {

      return {
        'RequiredDays': RequestLeavePage.DayFracError
      }
    }
    else {

      return null;
    }
  }

  static isValidReqReason(control: FormControl) {


    if (RequestLeavePage.mustReason == true && Number.parseInt(control.value) === 0) {
      return {
        'theMust': RequestLeavePage.ReasonError
      }
    }
    // if (RequestLeavePage.mustReason == false) {
    //   return null;
    // }
    return null;
  }
  saveLeaves(item) {

    if (this.item.Id != 0) {
      this.requestObj.Id = this.item.Id;
    }

    this.requestObj.TypeId = this.leaveType;
    this.requestObj.EmpId = this.user.EmpId;
    this.requestObj.CompanyId = this.user.CompanyId;
    this.requestObj.Culture = this.user.Culture;
    this.requestObj.NofDays = Number.parseInt(this.noOfDays);
    this.requestObj.DayFraction = (this.fraction) ? Number.parseInt(this.fraction) : 0;
    this.requestObj.StartDate = new Date(new Date(this.startDate).toString()).toLocaleDateString();//.slice(0, -1);
    this.requestObj.EndDate = new Date(new Date(this.endDate).toString()).toLocaleDateString()//.slice(0, -1);
    this.requestObj.ReturnDate = new Date(new Date(this.returnDate).toString()).toLocaleDateString()//.slice(0, -1);
    this.requestObj.ReqReason = Number.parseInt(this.reason);
    this.requestObj.ReasonDesc = this.comments;
    this.requestObj.ApprovalStatus = ApprovalStatusEnum.Draft
    this.requestObj.ReplaceEmpId = Number.parseInt(this.replacement);
    this.requestObj.BalanceBefore = this.balBefore;
    this.requestObj.BalBefore = this.balBefore;
    this.requestObj.submit = item;
    this.requestObj.Type = this.LeavesData.find((ele) => ele.Id == this.requestObj.TypeId).Name;




    this.requestObj.Id = this.item.Id;

    if (this.requestObj.Id && this.EditFlag == 1) {

      //Loader
      let EditLeavesLoader = this.loadingCtrl.create({
        content: "Editing Leaves..."
      });
      //Toaster
      let EditErrorToast = this.ToastCtrl.create({
        message: "Error in updating Leave, Please Try again later.",
        duration: 3000,
        position: 'middle'
      });
      let EditSuccessToast = this.ToastCtrl.create({
        message: 'Leave is edited successfully.',
        duration: 2000,
        position: 'bottom'
      });

      EditLeavesLoader.present().then(() => {
        this.LeaveServices.editLeaveRequest(this.requestObj).subscribe((data) => {
          if (data.length) {
            this.errorArray = data; //error coming
            EditLeavesLoader.dismiss().then(() => {
              EditErrorToast.present();
            });
          }
          else {
            LeaveListPage.motherArr = LeaveListPage.motherArr.filter((ele) => ele.Id !== this.item.Id);

            data.Type = this.requestObj.Type;
            LeaveListPage.motherArr.push(data);
            this.navCtrl.pop();
            EditLeavesLoader.dismiss().then(() => {
              EditSuccessToast.present();
            });
          }

        }, (err) => {

          EditLeavesLoader.dismiss().then(() => {
            EditErrorToast.present();
          });
        });
      });//EditLeaves Loader
    }
    else if (!this.requestObj.Id && this.EditFlag == 0) {
      this.requestObj.Id = 0;

      //Loader
      let AddLeavesLoader = this.loadingCtrl.create({
        content: "Adding Leaves..."
      });
      //Toaster
      let AddErrorToast = this.ToastCtrl.create({
        message: "Error in Adding Leave, Please Try again later.",
        duration: 3000,
        position: 'middle'
      });
      let AddSuccessToast = this.ToastCtrl.create({
        message: 'Leave is Added successfully.',
        duration: 2000,
        position: 'bottom'
      });

      AddLeavesLoader.present().then(() => {
        this.LeaveServices.addLeaveRequest(this.requestObj).subscribe((data) => {
          if (data.length) {
            this.errorArray = data;
            AddLeavesLoader.dismiss().then(() => {
              AddErrorToast.present();
            })
          } else {
            data.Type = this.requestObj.Type;
            LeaveListPage.motherArr.push(data);
            this.navCtrl.pop();
            AddLeavesLoader.dismiss().then(() => {
              AddSuccessToast.present();
            })
          }
        }, (err) => {

          AddLeavesLoader.dismiss().then(() => {
            AddErrorToast.present();
          })
        })
      })//AddLeaves Loader

    }

  }

  // ///////////////// disable one input due to focuse in another
  // FocusInput() {
  //   
  //    this.disableFlagFarc = true; }
  // FocusInputFrac() { this.disableFlagNoOfDays = true; }
  // BlurInput(noOfDays) {
  //   
  //   if (noOfDays) { this.disableFlagFarc = true; }
  //   else { this.disableFlagFarc = false; }
  // }
  // BlurInputFrac(fraction) {
  //   if (fraction == 0) { this.disableFlagNoOfDays = false; }
  //   else if (fraction && fraction != 0) { this.disableFlagNoOfDays = true; }
  //   else { this.disableFlagNoOfDays = false; }
  // }
  // BlurDateTime(startDate) {
  //   
  //   if (startDate == null || !startDate) {
  //     
  //     this.disableFlagNoOfDays = true;
  //     this.disableFlagFarc = true;
  //   }
  //   else if (startDate) {
  //     
  //     this.disableFlagNoOfDays = false;
  //     this.disableFlagFarc = false;
  //   }
  // }
  ///////////////////////////////////////////
  // static isValid(control: FormControl) {
  //   
  //   if (RequestLeavePage.allowed == null) {
  //     return {
  //       "noLeave": "Select Leave Type First"
  //     }
  //   }
  //   let x = (Number.parseInt(control.value) + Number.parseFloat(RequestLeavePage.frac.toString()));
  //   
  //   if (x > RequestLeavePage.maxDays && RequestLeavePage.maxDays != null) {
  //     return {
  //       "maximum": "bigger than Maximum"
  //     }
  //   }

  //   if (control.value > RequestLeavePage.allowed) {
  //     return {
  //       "allowed": "bigger than allowed"
  //     };
  //   }
  //   if (isNaN(control.value)) {
  //     return {
  //       "general": "not a number"
  //     };
  //   }

  //   if (control.value % 1 !== 0) {
  //     return {
  //       "general": "not a whole number"
  //     };
  //   }

  //   if (Number.parseInt(control.value) <= 0) {
  //     return {
  //       "general": "zero or negative not allowed."
  //     }
  //   }

  //   return null;
  // }
}
