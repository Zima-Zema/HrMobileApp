import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LeaveServicesApi, IRequestType } from "../../../shared/LeavesService"
import { Storage } from '@ionic/storage';
import { IUser } from '../../../shared/IUser';
import { TasksServicesApi } from '../../../shared/TasksService';

@IonicPage()
@Component({
  selector: 'page-charts',
  templateUrl: 'charts.html',
})
export class ChartsPage {

  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('doughnutTaskCanvas') doughnutTaskCanvas;
  @ViewChild('barCanvas') barCanvas;

  doughnutChart: any;
  barChart: any;
  doughnutTaskChart:any;

  public ChartData: Array<any> = [];
  public DoneTasks: number = 0;
  public AssignToTasks: number = 0;

  user: IUser;
  RequestTypeObj: IRequestType = {
    CompId: 0,
    Culture: "",
    EmpId: 0
  }
  public LoadingChart = this.loadingCtrl.create({
    spinner: 'dots'
  });
  public ErrorMsgToast = this.ToastCtrl.create({
    message: "There Is Error, Please Try Again Later...",
    duration: 2000,
    position: 'middle'
  });

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private LeaveServices: LeaveServicesApi,
    private ToastCtrl: ToastController,
    private storage: Storage,
    private tasksService: TasksServicesApi, ) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.RequestTypeObj.CompId = this.user.CompanyId;
        this.RequestTypeObj.Culture = this.user.Culture;
        this.RequestTypeObj.EmpId = this.user.EmpId;
      }
    });

  }

  ionViewDidLoad() {
    this.LoadingChart.present().then(() => {
      //Leaves
      this.LeaveServices.GetLeaveTypes(this.RequestTypeObj).subscribe((Konafa) => {
        this.ChartData = Konafa.ChartData;
        this.loadCharts(this.ChartData);
        this.LoadingChart.dismiss();
      }, (e) => {
        this.LoadingChart.dismiss().then(() => {
          this.ErrorMsgToast.present();
        })
      })
      //Tasks
      let emp_id = this.user.EmpId;
      this.tasksService.getTasks(emp_id).subscribe((data) => {
        console.log("Tasks : ", data);
        data.forEach(element => {
          if (element.Status == 1) {
            this.AssignToTasks++;
          }
          else if (element.Status == 2) {
            this.DoneTasks++;
          }
        });
         this.loadTaskChart(this.DoneTasks, this.AssignToTasks)
        // console.log("Done : ", this.DoneTasks);
        // console.log("AssignTo : ", this.AssignToTasks);
      }, (e) => {
        this.LoadingChart.dismiss().then(() => {
          this.ErrorMsgToast.present();
        })
      })
    })
  }

  loadTaskChart(doneCount, AssignToCount) {
    let DataTemp: Array<number> = [];
    DataTemp.push(doneCount);
    DataTemp.push(AssignToCount);
    this.doughnutTaskChart = new Chart(this.doughnutTaskCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Done','Assign To'],
        datasets: [{
          data: DataTemp,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(205, 92, 92 , 0.2)',
            'rgba(128, 128, 0 , 0.2)',
            'rgba(41, 56, 185 ,0.2)', //magenta
            'rgba(91, 44, 111 , 0.2)', //dark magenta
            'rgba(26, 115, 50 ,0.2)' //dark green
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
            "#2938B9", // magenta
            "#5B2C6F", //dark magenta
            "#1A7332" //dark green
          ]
        }]
      }
    })
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
          label: '',
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
            'rgba(41, 56, 185 ,0.2)', //magenta
            'rgba(91, 44, 111 , 0.2)', //dark magenta
            'rgba(26, 115, 50 ,0.2)' //dark green
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
            "#2938B9", // magenta
            "#5B2C6F", //dark magenta
            "#1A7332" //dark green
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



}
