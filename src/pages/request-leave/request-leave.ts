import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { LeaveServicesApi, IRequestType, IRequestData } from '../../shared/LeavesService';
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
  public daysArr: Array<number> = [];
  public daysValue: Array<number> = [11,12,13];
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

  public RequestLeaveForm: FormGroup;
  public LeavesData: Array<any> = [];
  public ChartData: Array<any> = [];
  public requestData: any;
  public workhour: number;
  allowFraction: boolean = false;
  static maxDays: number = null;
  static allowed: number = null;
  static frac: number = 0;
  public static mustReason: boolean = true;
  pickFormat: string;
  displayFormat: string;
  public disableFlagNoOfDays: boolean = false;
  public disableFlagFarc: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder) {
    //Edit Mode
    this.item = this.navParams.data;
    //form validation
    this.RequestLeaveForm = this.formBuilder.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      noOfDays: ['', Validators.compose([Validators.required, RequestLeavePage.isValid])],
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
      // console.log("error ", e);
    })
    //console.log("minData : ", this.minDate);
    this.yearsValue = this.GetYears();
    console.log(`sundayssssss : ${this.getDefaultOffDays(2017)}`);
  }
  // ///////////////// disable one input due to focuse in another
  FocusInput() {
    this.disableFlagFarc = true;
    console.log(`Test FocusFlag : ${this.disableFlagFarc}`)
  }
  FocusInputFrac() {
    this.disableFlagNoOfDays = true;
    console.log(`Test FocusFlagFarc : ${this.disableFlagNoOfDays}`)
  }
  BlurInput(noOfDays) {
    console.log(`Test noOfDays : ${noOfDays}`);
    if (noOfDays) {
      this.disableFlagFarc = true;
    }
    else {
      this.disableFlagFarc = false;
    }
  }
  BlurInputFrac(fraction) {
    console.log(`Test fraction : ${fraction}`);
    if (fraction == 0) {
      console.log("ana hena")
      this.disableFlagNoOfDays = false;
    }
    else if (fraction) {
      this.disableFlagNoOfDays = true;
    }
    else {
      this.disableFlagNoOfDays = false;
    }
  }
  // /////////////////////////////////////////////
  
getDefaultOffDays(year) {
  var offdays = new Array();
 let i = 0;
  for (let month = 1; month <= 12; month++) {
   let tdays = new Date(year, month, 0).getDate();

    for (let date = 1; date <= tdays; date++) {
     let smonth = (month < 10) ? "0" + month : month;
     let sdate = (date < 10) ? "0" + date : date;
     let dd = year + "-" + smonth + "-" + sdate;

     let day = new Date();
      day.setDate(date);
      day.setMonth(month-1);
      day.setFullYear(year);

      if (day.getDay() == 5 || day.getDay() ==6) {
        offdays[i++] = dd;
      }
    }
  }
  return offdays;
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
  leaveChange(item: any) {
    this.resetForm();
    //console.log("itemSelected ", item);
    this.RequestDataObj.TypeId = item;
    this.RequestDataObj.StartDate = new Date().toDateString();
    this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
      console.log("data GetRequestLeaveData ", data);
      this.workhour = data.Calender.WorkHours;
      this.requestData = data;
      this.allowedDays = data.requestVal.AllowedDays;
      this.allowFraction = data.LeaveType.AllowFraction;
      RequestLeavePage.maxDays = data.requestVal.MaxDays;
      RequestLeavePage.allowed = data.requestVal.AllowedDays;
      RequestLeavePage.mustReason = data.LeaveType.MustAddCause;
      //console.log("RequestLeavePage.mustReason", RequestLeavePage.mustReason)

      if (RequestLeavePage.mustReason == true) {
        if (this.EditFlag == 0) { //Request Mode -- > set ddl to 0 
          this.RequestLeaveForm.controls['reason'].setValue(0);
        }
        this.RequestLeaveForm.controls['reason'].markAsDirty({ onlySelf: true });
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
    this.bindForm();
  }
  fractionChange(item: number) {
    if(item) {
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
  public trystart: any;
bindForm() {

  let MilliDate = new Date(this.startDate).setHours(8);
  this.startDate = new Date(MilliDate);
  this.trystart = moment(this.startDate).format('lll');
  console.log("bindForm startDate", this.startDate);
  console.log(`bindForm EndDate : ${this.endDate}`);
  console.log("bindForm Calender : ", this.requestData.Calender)
  console.log(`bindForm noOfDays: ${this.noOfDays} , fraction : ${this.fraction}`)
  console.log(`bindForm LeaveType : ${this.requestData.LeaveType}`)
  // if (this.startDate && this.noOfDays) {
  if (this.startDate) {
    let res = this.LeaveServices.calcDates(this.startDate, this.noOfDays, this.requestData.Calender, this.requestData.LeaveType, this.fraction);
    console.log("res : ", res);
    this.trystart = res.startDate;
    moment.locale();
    if (this.EditFlag == 0 || this.EditFlag == 1) {
      this.endDate = this.allowFraction ? moment(res.endDate).format('lll') : moment(res.endDate).format('l');
      this.returnDate = this.allowFraction ? moment(res.returnDate).format('lll') : moment(res.returnDate).format('l');
      this.startDate = this.allowFraction ? this.bloodyIsoString(new Date(res.startDate)) : res.startDate;
      this.balAfter = this.balBefore - (Number.parseFloat(this.noOfDays) + (this.fraction ? Number.parseFloat(this.fraction) : 0));
    }
  }
}
resetForm() {
  RequestLeavePage.allowed = null;
  RequestLeavePage.maxDays = null;
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
  this.navCtrl.pop();
  //.push(LeaveListPage);
}


}
