import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LeaveServicesApi, IRequestType, IRequestData } from '../../shared/LeavesService';
import { LeaveListPage } from '../leave-list/leave-list';


@IonicPage()
@Component({
  selector: 'page-request-leave',
  templateUrl: 'request-leave.html',
})
export class RequestLeavePage {
  // @ViewChild('doughnutCanvas') doughnutCanvas;
  // doughnutChart: any;

  //Form ngModel
  public leaveType: any;
  public startDate: any;
  public noOfDays: any;
  public allowedDays: number = 0;
  public reservedDays: number = 0;
  public returnDate: any;
  public endDate: any;
  public balBefore: number = 0;
  public balAfter: number = 0;
  public replacement: any;
  public comments: any;
  
  minDate = this.bloodyIsoString(new Date());

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
    StartDate: "2017-09-24 00:00:00.000"
  }
  public RequestLeaveForm: FormGroup;
  public LeavesData: Array<any> = [];


  public Replace: Array<any> = [];
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string = 'doughnut';

  public doughnutOptions: any = {
    animation: {
      duration: 3000
    }
  };






  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder) {
    console.log("From Cons>>>", new Date().toISOString());
    this.RequestLeaveForm = this.formBuilder.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      noOfDays: ['', Validators.required],
      allowedDays: [''],
      reservedDays: [''],
      endDate: [''],
      returnDate: [''],
      balBefore: [''],
      balAfter: [''],
      replacement: [''],
      comments: ['']


    });
    // this.leaving = 1067;  //annual leave 
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RequestLeavePage');
    // console.log("leaving ", this.leaveType);
    // this.LeaveServices.GetLeaveTypes(this.RequestTypeObj).subscribe((data) => {
    //   console.log("leavetyps>>>", data);
    //   this.LeavesData = data;
    // }, (e) => {
    //   console.log("error ", e);
    // })
  }

  ionViewWillEnter() {

  }
  /////////////////////
  // leaveChange(item: any) {
  //   console.log("itemSelected ", item);
  //   this.RequestDataObj.TypeId = item;
  //   this.RequestDataObj.StartDate = "2017-09-24 00:00:00.000";
  //   this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
  //     console.log("data GetRequestLeaveData ", data);
  //     this.allowedDays = data.requestVal.AllowedDays;
  //     this.Replace = data.Replacements;
  //     console.log("rrrrrrr ", this.Replace)
  //   }, (err) => {
  //     console.log("error ", err)
  //   })
  // }

  saveLeaves() {
    this.navCtrl.push(LeaveListPage);
  }


}
