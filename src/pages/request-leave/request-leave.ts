import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { LeaveServicesApi, IRequestType, IRequestData, ILeaveRequest, ApprovalStatusEnum, IValidate, IValidationMsg } from '../../shared/LeavesService';
import { LeaveListPage } from '../leave-list/leave-list';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { DatePickerDirective } from 'ion-datepicker';

@IonicPage()
@Component({
  selector: 'page-request-leave',
  templateUrl: 'request-leave.html',
})
export class RequestLeavePage {

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
  //public EditFlag: boolean = false;
  public EditFlag: number = 0;
  public BtnTxt: string = "Submit";
  public YearsArr: Array<number> = [];
  public yearsValue: Array<number> = [];
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
  public minDate: any;
  public rate: number = 0;
  public errorArray: Array<string> = [];
  // minDate = this.bloodyIsoString(new Date());
  // minDate = this.bloodyIsoString(new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0)));

  RequestTypeObj: IRequestType = {
    CompId: 0,
    Culture: "en-GB",
    EmpId: 1072
  }
  RequestDataObj: IRequestData = {
    CompanyId: 0,
    TypeId: 1067,
    Culture: "ar-EG",
    EmpId: 1072,
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
    FractionDays: 0,
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
    WaitingMonth: null
  }
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
  public static frac: number = 0;
  public static FullData: any = null;
  public static mustReason: boolean = true;
  public static mustNoOfDays: number = null;
  pickFormat: string;
  displayFormat: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder) {
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
    // this.leaving = 1067;  //annual leave
    this.LeaveServices.GetLeaveTypes(this.RequestTypeObj).subscribe((Konafa) => {
      console.log("leavetyps>>>", Konafa);
      this.LeavesData = Konafa.LeaveTypeList;
      this.ChartData = Konafa.ChartData;
      this.Replacements = Konafa.Replacements;
      this.LeaveReasonList = Konafa.LeaveReasonList;
      this.loadCharts(this.ChartData);
    }, (e) => {
    })
    this.yearsValue = this.GetYears();
  }
  // // EditFlag = 0 ---> Request  , EditFlag = 1 ---> Edit , EditFlad = 2 --->show
  ionViewWillEnter() {
    if (Object.keys(this.item).length > 0) {
      //Edit Mode
      if (this.item.readOnly == false) {
        console.log("Edit Mode ", this.item);
        this.EditFlag = 1;
        this.BtnTxt = "Update";
        this.leaveChange(this.item.TypeId);
        this.leaveType = this.item.TypeId;
        console.log("AllowFrac", this.allowFraction);
        let SDate = new Date(this.item.StartDate);
        this.startDate = this.bloodyIsoString(new Date(new Date(this.item.StartDate).toDateString())).slice(0, -15);
        this.minDate = this.bloodyIsoString(SDate);
        this.noOfDays = this.item.NofDays;
        this.replacement = this.item.ReplaceEmpId;
        this.comments = this.item.ReasonDesc;
        this.reason = this.item.ReqReason;
      }
      //Show Mode
      else {
        console.log("Edit Mode ", this.item);
        this.EditFlag = 2;
        this.BtnTxt = "Update";
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
    console.log(`ionViewDidEnter EditFlag :: ${this.EditFlag} `);
    if (this.EditFlag == 0) {
      console.log(`ionViewDidEnter request mode :: ${this.EditFlag} `);
      this.RequestLeaveForm.controls['noOfDays'].disable();
      this.RequestLeaveForm.controls['startDate'].disable();
      this.RequestLeaveForm.controls['fraction'].disable();
    }
    else if (this.EditFlag == 1 && (this.RequestLeaveForm.controls['noOfDays'].value != 0 || this.RequestLeaveForm.controls['noOfDays'].value != "")) {
      console.log(`ionViewDidEnter noOfDays :: ${this.RequestLeaveForm.controls['noOfDays'].value} `);
      this.RequestLeaveForm.controls['noOfDays'].enable();
      this.RequestLeaveForm.controls['startDate'].enable();
      this.RequestLeaveForm.controls['fraction'].disable();
    }
    else if (this.EditFlag == 1 && (this.RequestLeaveForm.controls['fraction'].value != 0 || this.RequestLeaveForm.controls['fraction'].value != null)) {
      console.log(`ionViewDidEnter fraction :: ${this.RequestLeaveForm.controls['fraction'].value} `);
      this.RequestLeaveForm.controls['noOfDays'].disable();
      this.RequestLeaveForm.controls['startDate'].enable();
      this.RequestLeaveForm.controls['fraction'].enable();
    }
  }
  public disableFlagFarc: boolean = true;
  public disableFlagNoOfDays: boolean = true;
  public disableStartDate: boolean = true;

  // FocusInput() {
  //   console.log(`Focus`);
  //   this.disableFlagFarc = true;
  // }
  // FocusInputFrac() { this.disableFlagNoOfDays = true; }
  // BlurInput(noOfDays) {
  //   console.log(`BlurInput : ${noOfDays}`);
  //   if (noOfDays) { this.disableFlagFarc = true; }
  //   else { this.disableFlagFarc = false; }
  // }
  // BlurInputFrac(fraction) {
  //   if (fraction == 0) { this.disableFlagNoOfDays = false; }
  //   else if (fraction && fraction != 0) { this.disableFlagNoOfDays = true; }
  //   else { this.disableFlagNoOfDays = false; }
  // }

  // BlurDateTime(startDate) {
  //   console.log(` BlurDateTime(startDate) : ${startDate}`)
  //   if (startDate == null || !startDate) {
  //     console.log(`BlurDateTime Enable`)
  //     this.disableFlagNoOfDays = true;
  //     this.disableFlagFarc = true;
  //   }
  //   else if (startDate) {
  //     console.log(`BlurDateTime Disable`)
  //     this.disableFlagNoOfDays = false;
  //     this.disableFlagFarc = false;
  //   }
  // }

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
            'rgba(255, 159, 64, 0.2)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#27AE60",
            "#7B68EE",
            "#F39C12"
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
    //console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }


  /////////////////////
  value(item) {
    console.log(`Chang DDDDDDDDDDDDDDDate : ${item}`)
  }
  leaveChange(item: any) {
    //this.disableStartDate=false;
    this.RequestLeaveForm.controls['startDate'].enable();
    this.resetForm();
    //console.log("itemSelected ", item);
    this.RequestDataObj.TypeId = item;
    this.RequestDataObj.StartDate = new Date().toDateString();
    this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {

      console.log("data GetRequestLeaveData ", data);
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
        console.log("No 3arda");
        this.RequestLeaveForm.controls['noOfDays'].setValidators([RequestLeavePage.isDaysRequired, RequestLeavePage.isRequired]);
        this.RequestLeaveForm.controls['noOfDays'].updateValueAndValidity();
        this.RequestLeaveForm.controls['noOfDays'].markAsDirty({ onlySelf: true });
      }
      else if (RequestLeavePage.FullData && this.EditFlag != 2) {
        console.log("3arda");
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
        this.displayFormat = "MMM DD, YYYY hh:mm A";
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
        if (new Date(this.item.EndDate).getHours() > new Date(this.item.ReturnDate).getHours()) {
          this.fraction = -(this.noOfDays % 1);
          this.balAfter = this.balBefore - (Number.parseFloat(this.noOfDays) + (this.fraction ? this.fraction : 0));
          this.noOfDays = Math.trunc(this.noOfDays);
        } else {
          //doing Magic here
          this.fraction = this.noOfDays % 1;
          this.balAfter = this.balBefore - (Number.parseFloat(this.noOfDays) + (this.fraction ? this.fraction : 0));
          this.noOfDays = Math.trunc(this.noOfDays);
        }
        if (this.noOfDays > 0) {
          this.bindForm();
        }
      }
      else {
        this.balAfter = undefined;
      }

    }, (err) => {
      //console.log("error ", err)
    })
  }
  dateChange(item) {
    console.log(` dateChange item : ${item}`)
    if (item) {
      if (this.EditFlag != 2) {
        this.RequestLeaveForm.controls['noOfDays'].enable();
        this.RequestLeaveForm.controls['fraction'].enable();
        // console.log(`this.disableFlagNoOfDays : ${this.disableFlagNoOfDays} || this.disableFlagFarc : ${this.disableFlagFarc}`)
        // this.disableFlagNoOfDays = false;
        // this.disableFlagFarc = false;
      }
      this.startDate = this.bloodyIsoString(new Date(new Date(item).toDateString())).slice(0, -15);
      console.log(this.startDate);
      this.bindForm();
    }
  }
  //
  replacementChange(replacement) {
    console.log("replacementChange", replacement);
    this.validateObj.Id = this.item.Id ? this.item.Id : 0;
    this.validateObj.CompanyId = 0;
    this.validateObj.Culture = "ar-EG";
    this.validateObj.EmpId = 1072;
    this.validateObj.EndDate = new Date(new Date(this.endDate).toString()).toISOString().slice(0, -1);
    this.validateObj.StartDate = new Date(new Date(this.startDate).toString()).toISOString().slice(0, -1);
    this.validateObj.ReplaceEmpId = replacement;
    this.validateObj.TypeId = this.leaveType;
    if (this.endDate) {
      console.log("this.validateObj: ", this.validateObj);
      this.LeaveServices.validateRequest(this.validateObj).subscribe((data) => {
        this.errorMsgObj = null;
        this.errorMsgObj = data;
        this.rate = this.errorMsgObj.Stars;
        console.log(this.errorMsgObj);
      })
    }
  }
  //
  numberChange(item) {
    console.log(` numberChange item : ${item}`)
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
    console.log(`fractionChange : ${item}`)
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
    }
    else {
      RequestLeavePage.frac = 0
    }
    this.bindForm();
  }
  reasonChange(reason) {
  }

  bindForm() {
    // let MilliDate = new Date(this.startDate).setHours(8);
    // this.startDate = new Date(MilliDate);
    // console.log("bindForm startDate", this.startDate);
    // console.log(`bindForm EndDate : ${this.endDate}`);
    // console.log("bindForm Calender : ", this.requestData.Calender)
    // console.log(`bindForm noOfDays: ${this.noOfDays} , fraction : ${this.fraction}`)
    // console.log(`bindForm LeaveType : ${this.requestData.LeaveType}`)
    // if (this.startDate && this.noOfDays) {
    if (this.startDate && (this.noOfDays || this.fraction)) {
      let res = this.LeaveServices.calcDates(this.startDate, this.noOfDays, this.requestData.Calender, this.requestData.LeaveType, this.fraction);
      //console.log("res : ", res);
      this.endDate = this.allowFraction ? new Date(res.endDate).toISOString() : new Date(res.endDate).toISOString();
      //console.log(`End Date ${this.endDate}`);
      this.returnDate = this.allowFraction ? new Date(res.returnDate).toISOString() : new Date(res.returnDate).toISOString();
      this.startDate = this.allowFraction ? new Date(res.startDate).toISOString() : new Date(res.startDate).toISOString();
      this.balAfter = this.balBefore - Math.abs((Number.parseFloat(this.noOfDays) + (this.fraction ? Number.parseFloat(this.fraction) : 0)));

      this.validateObj.Id = this.item.Id ? this.item.Id : 0;
      this.validateObj.CompanyId = 0;
      this.validateObj.Culture = "ar-EG";
      this.validateObj.EmpId = 1072;
      this.validateObj.EndDate = new Date(new Date(this.endDate).toString()).toISOString().slice(0, -1);
      this.validateObj.StartDate = new Date(new Date(this.startDate).toString()).toISOString().slice(0, -1);
      this.validateObj.ReplaceEmpId = this.replacement;
      this.validateObj.TypeId = this.leaveType;
      console.log("this.validateObj: ", this.validateObj);
      if (this.endDate) {
        this.LeaveServices.validateRequest(this.validateObj).subscribe((data) => {
          this.errorMsgObj = null;
          this.errorMsgObj = data;
          this.rate = this.errorMsgObj.Stars;
          console.log(this.errorMsgObj);
        })
      }




    }
  }
  resetForm() {
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
  static isRequired(control: FormControl) {
    console.log("isRequired : control.value : ", control.value);
    if (Number.parseInt(control.value) < 0) {
      console.log(`Generaaaaaaaaaal`)
      return {
        "general": "zero or negative not allowed."
      }
    }
    else {
      return null;
    }

  }

  static isDaysRequired(control: FormControl) {
    console.log("isDaysRequired :  control.value : ", control.value);
    if (control.value >= 1) { //to make sure the coming value is no. of days not a fraction
      let x = Number.parseInt(control.value);
      console.log(`x :: ${x}`);
      if (x > RequestLeavePage.maxDays && RequestLeavePage.maxDays != null) {
        return {
          "maximum": "bigger than Maximum"
        }
      }
      if (control.value > RequestLeavePage.allowed) {
        return {
          "allowed": "bigger than allowed"
        };
      }
      if (isNaN(control.value)) {
        return {
          "general": "not a number"
        };
      }
      if (control.value % 1 !== 0) {
        return {
          "general": "not a whole number"
        };
      }

    }
    if (RequestLeavePage.FullData == false && (control.value == null || control.value == "")) {
      console.log(`2ol no 3arda`);
      return {
        'RequiredDays': "Required"
      }
    }
    else if (RequestLeavePage.FullData == true && (control.value == null || control.value == "" || control.value == 0)) {
      console.log(`2ol 3aaaaaaaaaaaaaaaaaaaaaaa`);
      return {
        'RequiredDays': "No. Of Days OR Fraction Should Be Inserted."
      }
    }
    else {
      console.log(`2ol nullllllllllllllllllllllll`);
      return null;
    }
  }

  // static isValid(control: FormControl) {
  //   console.log("validationAllowed", RequestLeavePage.allowed);
  //   if (RequestLeavePage.allowed == null) {
  //     return {
  //       "noLeave": "Select Leave Type First"
  //     }
  //   }
  //   let x = (Number.parseInt(control.value) + Number.parseFloat(RequestLeavePage.frac.toString()));
  //   console.log(`x :: ${x}`)
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

  static isValidReqReason(control: FormControl) {
    console.log(`first here RequestLeavePage.mustReason : ${RequestLeavePage.mustReason}`)
    // if (RequestLeavePage.mustReason == null) {
    //   return {
    //     "noLeave": "Select Leave Type First"
    //   }
    // }
    //console.log("control.value>>", typeof control.value, control.value);
    if (RequestLeavePage.mustReason == true && Number.parseInt(control.value) === 0) {
      return {
        'theMust': "This Leave Type Must Have Reason"
      }
    }
    // if (RequestLeavePage.mustReason == false) {
    //   return null;
    // }
    return null;
  }
  saveLeaves(item) {
    console.log(typeof item);
    console.log("submit>>", item);
    console.log("RequestId: ", this.item.Id);
    if (this.item.Id != 0) {
      this.requestObj.Id = this.item.Id;
    }

    this.requestObj.TypeId = this.leaveType;
    this.requestObj.EmpId = 1072;
    this.requestObj.CompanyId = 0;
    this.requestObj.Culture = "ar-EG";
    this.requestObj.NofDays = Number.parseInt(this.noOfDays);
    this.requestObj.FractionDays = Number.parseFloat(this.fraction);
    this.requestObj.StartDate = new Date(new Date(this.startDate).toString()).toISOString().slice(0, -1);
    this.requestObj.EndDate = new Date(new Date(this.endDate).toString()).toISOString().slice(0, -1);
    this.requestObj.ReturnDate = new Date(new Date(this.returnDate).toString()).toISOString().slice(0, -1);
    this.requestObj.ReqReason = Number.parseInt(this.reason);
    this.requestObj.ReasonDesc = this.comments;
    this.requestObj.ApprovalStatus = ApprovalStatusEnum.Draft
    this.requestObj.ReplaceEmpId = Number.parseInt(this.replacement);
    this.requestObj.BalanceBefore = this.balBefore;
    this.requestObj.BalBefore = this.balBefore;
    this.requestObj.submit = item;
    this.requestObj.Type = this.LeavesData.find((ele) => ele.Id == this.requestObj.TypeId).Name;


    console.log(this.requestObj);

    this.requestObj.Id = this.item.Id;

    if (this.requestObj.Id && this.EditFlag == 1) {
      console.log("We Are Editing");
      this.LeaveServices.editLeaveRequest(this.requestObj).subscribe((data) => {
        if (data.length) {
          this.errorArray = data;
        }
        else {
          LeaveListPage.motherArr = LeaveListPage.motherArr.filter((ele) => ele.Id !== this.item.Id);
          console.log(`The Return After Insert ${data}`);
          data.Type = this.requestObj.Type;
          LeaveListPage.motherArr.push(data);
          this.navCtrl.pop();
        }

      }, (err) => {
        console.log(`The Return Error ${err}`);
      })
    }
    else if (!this.requestObj.Id && this.EditFlag == 0) {
      this.requestObj.Id = 0;
      console.log("We Are Inserting");
      this.LeaveServices.addLeaveRequest(this.requestObj).subscribe((data) => {
        if (data.length) {
          this.errorArray = data;
        } else {
          data.Type = this.requestObj.Type;
          LeaveListPage.motherArr.push(data);
          this.navCtrl.pop();
        }
      }, (err) => {
        console.log(`The Return Error ${err}`);
      })
    }

  }

  // ///////////////// disable one input due to focuse in another
  // FocusInput() {
  //   console.log(`Focus`);
  //    this.disableFlagFarc = true; }
  // FocusInputFrac() { this.disableFlagNoOfDays = true; }
  // BlurInput(noOfDays) {
  //   console.log(`BlurInput : ${noOfDays}`);
  //   if (noOfDays) { this.disableFlagFarc = true; }
  //   else { this.disableFlagFarc = false; }
  // }
  // BlurInputFrac(fraction) {
  //   if (fraction == 0) { this.disableFlagNoOfDays = false; }
  //   else if (fraction && fraction != 0) { this.disableFlagNoOfDays = true; }
  //   else { this.disableFlagNoOfDays = false; }
  // }
  // BlurDateTime(startDate) {
  //   console.log(` BlurDateTime(startDate) : ${startDate}`)
  //   if (startDate == null || !startDate) {
  //     console.log(` Enable`)
  //     this.disableFlagNoOfDays = true;
  //     this.disableFlagFarc = true;
  //   }
  //   else if (startDate) {
  //     console.log(` Disable`)
  //     this.disableFlagNoOfDays = false;
  //     this.disableFlagFarc = false;
  //   }
  // }
}
