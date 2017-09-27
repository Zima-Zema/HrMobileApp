import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LeaveServicesApi, IRequestType, IRequestData } from '../../shared/LeavesService';
import { LeaveListPage } from '../leave-list/leave-list';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-request-leave',
  templateUrl: 'request-leave.html',
})
export class RequestLeavePage {
@ViewChild('doughnutCanvas') doughnutCanvas;
doughnutChart: any;
  RequestTypeObj: IRequestType = {
    CompId: 0,
    Culture: "ar-EG",
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
  public leaving: any;
  public AllowedDays: number = 0;
  public Replace:Array<any>=[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder) {
   // this.leaving = 1067;  //annual leave 
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestLeavePage');
    
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
 
            type: 'doughnut',
            data: {
                labels: ["عاديه", "اعتيادى"],
                datasets: [{
                    label: '# of Votes',
                    data: [3, 6],
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
  }

  ionViewWillEnter() {
    console.log("leaving ", this.leaving);
    this.LeaveServices.GetLeaveTypes(this.RequestTypeObj).subscribe((data) => {
      this.LeavesData = data;
    }, (e) => {
      console.log("error ", e);
    })
  }
  /////////////////////
  leaveChange(item: any) {
    console.log("itemSelected ", item);
    this.RequestDataObj.TypeId = item;
    this.RequestDataObj.StartDate = "2017-09-24 00:00:00.000";
    this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
      console.log("data GetRequestLeaveData ", data);
      this.AllowedDays = data.requestVal.AllowedDays;
      this.Replace=data.Replacements;
      console.log("rrrrrrr ",this.Replace)
    }, (err) => {
      console.log("error ", err)
    })
  }
  saveLeaves() {
    this.navCtrl.push(LeaveListPage);
  }


}
