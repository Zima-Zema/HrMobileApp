import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
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
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
 // @ViewChild(Slides) slides: Slides;
  barChart: any;
  doughnutChart: any;

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
  public reason: any;

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
  public ChartData: Array<any> = [];
 

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
      comments: [''],
      reason: ['']


    });
    // this.leaving = 1067;  //annual leave 
    console.log("This is the Bloody contructor");

    console.log("leaving ", this.leaveType);
    this.LeaveServices.GetLeaveTypes(this.RequestTypeObj).subscribe((Konafa) => {
      console.log("leavetyps>>>", Konafa);
      this.LeavesData = Konafa;
      this.ChartData = Konafa.ChartData;
      this.loadCharts(this.ChartData);
    }, (e) => {
      console.log("error ", e);
    })

    console.log("minData : ",this.minDate);
  }


  //doughnut chart
  loadCharts(chartData: Array<any>) {
    let lableTemp: Array<string> = [];
    let dataTemp: Array<number> = [];
    let DaysTemp: Array<number> = [];
    console.log("chartData", chartData);
    chartData.forEach((item) => {
      console.log("item", item)
      lableTemp.push(item.Name);
      dataTemp.push(item.Balance);
      DaysTemp.push(item.Days)
    })

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
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  ionViewDidLoad() {

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
