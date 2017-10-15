import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { LeaveServicesApi, IRequestType, IRequestData, ILeaveRequest, ApprovalStatusEnum } from '../../shared/LeavesService';
import { LeaveListPage } from '../leave-list/leave-list';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-request-leave',
  templateUrl: 'request-leave.html',
})
export class RequestLeavePage {

  public item: any;

  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('barCanvas') barCanvas;
  doughnutChart: any;
  barChart: any;

  //public EditFlag: boolean = false;
  public EditFlag: number = 0;
  public BtnTxt: string = "Submit";
  public YearsArr: Array<number> = [];
  public yearsValue: Array<number> = [];
  //

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
    ApprovalStatus: ApprovalStatusEnum.New
  }

  public RequestLeaveForm: FormGroup;
  public LeavesData: Array<any> = [];
  public ChartData: Array<any> = [];
  public requestData: any;
  public workhour: number;
  allowFraction: boolean = false;
  static maxDays: number = null;
  static allowed: number = null;
  static frac: number = 0;
  public static FullData: any = null;
  public static mustReason: boolean = true;
  public static mustFrac: number = null;
  pickFormat: string;
  displayFormat: string;
  public disableFlagNoOfDays: boolean = false;
  public disableFlagFarc: boolean = false;
  // public weekendArr: Array<any> = [];
  // public alldays: Array<any> = [];
  // public newDaysArr: Array<number> = [];
  // public daysArr: Array<number> = [];
  // public daysValue: Array<number> = [];


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder) {
    this.disableFlagNoOfDays = true;
    this.disableFlagFarc = true;
    //Edit Mode
    this.item = this.navParams.data;
    //form validation
    this.RequestLeaveForm = this.formBuilder.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      noOfDays: ['', Validators.compose([RequestLeavePage.isRequired])],
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
      this.LeavesData = Konafa;
      this.ChartData = Konafa.ChartData;
      this.loadCharts(this.ChartData);
    }, (e) => {
    })
    this.yearsValue = this.GetYears();

  }
  // ///////////////// disable one input due to focuse in another
  FocusInput() { this.disableFlagFarc = true; }
  FocusInputFrac() { this.disableFlagNoOfDays = true; }
  BlurInput(noOfDays) {
    if (noOfDays) { this.disableFlagFarc = true; }
    else { this.disableFlagFarc = false; }
  }
  BlurInputFrac(fraction) {
    if (fraction == 0) { this.disableFlagNoOfDays = false; }
    else if (fraction && fraction != 0) { this.disableFlagNoOfDays = true; }
    else { this.disableFlagNoOfDays = false; }
  }
  BlurDateTime(startDate) {
    console.log(` BlurDateTime(startDate) : ${startDate}`)
    if (startDate == null || !startDate) {
      console.log(` Enable`)
      this.disableFlagNoOfDays = true;
      this.disableFlagFarc = true;
    }
    else if (startDate) {
      console.log(` Disable`)
      this.disableFlagNoOfDays = false;
      this.disableFlagFarc = false;
    }

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
        let SDate = new Date(this.item.StartDate);
        this.startDate = new Date(this.item.StartDate).toISOString().slice(0, -1);
        this.minDate = this.bloodyIsoString(SDate);
        this.noOfDays = this.item.NofDays;
        this.returnDate = this.item.ReturnDate;
        this.endDate = this.item.EndDate;
        this.replacement = this.item.ReplaceEmpId;
        this.comments = this.item.ReasonDesc;
        this.reason = this.item.ReqReason;
      }
      //Show Mode
      else {
        console.log("Show Mode");
        this.EditFlag = 2;
        this.leaveChange(this.item.TypeId);
        this.leaveType = this.item.TypeId;
        let SDate = new Date(this.item.StartDate);
        this.startDate = this.bloodyIsoString(SDate);
        this.minDate = this.bloodyIsoString(SDate);
        this.noOfDays = this.item.NofDays;
        this.returnDate = this.item.ReturnDate;
        this.endDate = this.item.EndDate;
        this.replacement = this.item.ReplaceEmpId;
        this.reason = this.item.ReqReason;
        this.comments = this.item.ReasonDesc;
      }
    }
    //Request Mode
    else {
      this.EditFlag = 0;
      this.BtnTxt = "Submit";
      this.minDate = this.bloodyIsoString(new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0)));
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
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",

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

  ionViewDidLoad() { }
  /////////////////////
  value(item) {
    console.log(`Chang DDDDDDDDDDDDDDDate : ${item}`)
  }
  leaveChange(item: any) {
    this.resetForm();
    //console.log("itemSelected ", item);
    this.RequestDataObj.TypeId = item;
    this.RequestDataObj.StartDate = new Date().toDateString();
    this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
      //
      // this.yearsValue.forEach(year => {
      //   console.log(`Year : ${year}`)
      //   this.weekendArr = this.LeaveServices.getFriSat(year, data.Calender); //all weekends in year
      //   console.log(`this.weekendArr : ${this.weekendArr}`)
      //   this.alldays = this.LeaveServices.getallDays(year);

      //   this.daysArr = this.alldays.filter(x => this.weekendArr.indexOf(x) == -1); //all days without weekends
      //   this.daysArr.forEach(element => {
      //     let newDay = new Date(element).getDate();
      //     this.startDate = new Date(element);
      //     console.log(`this.startDate :: ${this.startDate}`)
      //     this.newDaysArr.push(newDay);
      //   });
      //   this.daysValue = this.newDaysArr;
      // });
      //
      console.log("data GetRequestLeaveData ", data);
      this.workhour = data.Calender.WorkHours;
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
      if (RequestLeavePage.FullData == false) //مش اجازه عارضه 
      {
        this.RequestLeaveForm.controls['noOfDays'].setValue(null);
        this.RequestLeaveForm.controls['noOfDays'].markAsDirty({ onlySelf: true });
      }
      //
      if (!this.allowFraction) {
        this.fraction = undefined;
        this.pickFormat = 'MMM DD YYYY';
        this.displayFormat = "MMM DD, YYYY"
      }
      else { //العارضه
        this.pickFormat = 'MMM DD YYYY';
        this.displayFormat = "MMM DD, YYYY hh:mm";
      }
      //
      if (data.LeaveType.AbsenceType == 8) {
        this.minDate = this.bloodyIsoString(new Date()).slice(0, -6);
        //console.log(`Fatma: ${this.minDate}`);
        //this.startDate = new Date();
      }
      else {
        this.minDate = this.bloodyIsoString(new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0)));
      }
      this.reservedDays = data.requestVal.ReservedDays
      this.balBefore = data.requestVal.BalBefore;
      if (this.EditFlag == 1 || this.EditFlag == 2) {
        this.fraction = this.noOfDays % 1;
        this.balAfter = this.balBefore - (Number.parseFloat(this.noOfDays) + (this.fraction ? this.fraction : 0));
        this.noOfDays = Math.trunc(this.noOfDays);
      }
      else {
        this.balAfter = undefined;
      }

    }, (err) => {
      //console.log("error ", err)
    })
  }
  dateChange(item) {
    this.bindForm();
  }
  numberChange(item) {
    RequestLeavePage.mustFrac = this.RequestLeaveForm.controls['fraction'].value;
    this.bindForm();
  }
  fractionChange(item: number) {
    if (item) {
      RequestLeavePage.frac = item;
      if (this.noOfDays) {
        this.RequestLeaveForm.controls['noOfDays'].updateValueAndValidity(this.RequestLeaveForm.controls['noOfDays'].value);
      }
    }
    else {
      RequestLeavePage.frac = 0
    }
    this.bindForm();
  }
  reasonChange(reason) {
  }

  bindForm() {
    console.log(`SSSSS : ${typeof (this.startDate)}`)
    // let MilliDate = new Date(this.startDate).setHours(8);
    // this.startDate = new Date(MilliDate);
    console.log("bindForm startDate", this.startDate);
    console.log(`bindForm EndDate : ${this.endDate}`);
    console.log("bindForm Calender : ", this.requestData.Calender)
    console.log(`bindForm noOfDays: ${this.noOfDays} , fraction : ${this.fraction}`)
    console.log(`bindForm LeaveType : ${this.requestData.LeaveType}`)
    // if (this.startDate && this.noOfDays) {
    if (this.startDate) {
      let res = this.LeaveServices.calcDates(this.startDate, this.noOfDays, this.requestData.Calender, this.requestData.LeaveType, this.fraction);
      console.log("res : ", res);

      if (this.EditFlag == 0 || this.EditFlag == 1) {
        this.endDate = this.allowFraction ? new Date(res.endDate).toISOString() : new Date(res.endDate).toISOString();
        console.log(`End Date ${this.endDate}`);
        this.returnDate = this.allowFraction ? new Date(res.returnDate).toISOString() : new Date(res.returnDate).toISOString();
        this.startDate = this.allowFraction ? new Date(res.startDate).toISOString() : new Date(res.startDate).toISOString();
        this.balAfter = this.balBefore - (Number.parseFloat(this.noOfDays) + (this.fraction ? Number.parseFloat(this.fraction) : 0));
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
    this.returnDate;
    this.endDate = null;
    this.balBefore = undefined;
    this.balAfter = undefined;
    this.replacement = null;;
    this.comments = null;;
    this.reason = null;;
    this.fraction = null;;
  }

  static isValid(control: FormControl) {
    console.log("validationAllowed", RequestLeavePage.allowed);
    if (RequestLeavePage.allowed == null) {
      return {
        "noLeave": "Select Leave Type First"
      }
    }
    let x = (Number.parseInt(control.value) + Number.parseFloat(RequestLeavePage.frac.toString()));
    console.log(`x :: ${x}`)
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

    if (Number.parseInt(control.value) <= 0) {
      return {
        "general": "zero or negative not allowed."
      }
    }

    return null;
  }
  static isRequired(control: FormControl) {
    console.log(`isRequired : ${RequestLeavePage.FullData} // control.value ${control.value}`);
    console.log(`isRequired fraction ${RequestLeavePage.mustFrac}`)
    if (RequestLeavePage.FullData == false && (control.value == null || control.value == "")) {
      return {
        'RequiredDays': "Required"
      }
    }
    else if (RequestLeavePage.FullData == true && (RequestLeavePage.mustFrac == null || RequestLeavePage.mustFrac == 0) && (control.value == null || control.value == "")) {
      console.log(`2ol 3aaaaaaaaaaaaaaaaaaaaaaa`);
      return {
        'RequiredDays': "No. Of Days OR Fraction Should Be Inserted."
      }
    }
  }
  static isValidReqReason(control: FormControl) {
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
  saveLeaves() {
    console.log("startDate", this.startDate);
    console.log("endDate", this.endDate);
    console.log("returnDate", this.returnDate);
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
    this.requestObj.ApprovalStatus = ApprovalStatusEnum.New;
    this.requestObj.ReplaceEmpId = Number.parseInt(this.replacement);
    this.requestObj.BalanceBefore = this.balBefore;
    this.requestObj.BalBefore = this.balBefore;

    console.log(this.requestObj);
    this.LeaveServices.addLeaveRequest(this.requestObj).subscribe((data) => {
      console.log(`The Return After Insert ${data}`);
    }, (err) => {
      console.log(`The Return Error ${err}`);
    })
    //this.navCtrl.pop();
    //.push(LeaveListPage);
  }


}
