import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AddTaskPage } from '../add-task/add-task';
import { DoneTaskPage } from '../done-task/done-task';
import { TasksServicesApi, ITasks } from '../../shared/TasksService'
import { CalendarComponent } from 'ionic2-calendar/calendar';

@IonicPage()
@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
  //   styles:[`.event-detail-container{
  //     .item-inner{
  //         //background-color:lemonchiffon ;
  //     }
  // }`]
})
export class TasksPage implements AfterViewInit {
  @ViewChild('template') template: ElementRef;
  ngAfterViewInit(): void {

  }


  //color = "#f53d3d";

  TaskObj: ITasks = {
    Id: 0,
    EmpListId: 0,
    TaskNo: 0,
    TaskCat: 0,
    Description: "",
    Priority: 0,
    Status: 0,
    Required: "",
    Unit: "",
    EmpId: 0,
    ManagerId: 0,
    AssignedTime: "",
    StartTime: "",
    Duration: 0,
    CreatedUser: "",
    ModifiedUser: "",
    CreatedTime: "",
    ModifiedTime: "",
    ExpectDur: 0,
    EndTime: "",
    SubPeriodId: 0,
    CompanyId: 0,
    //ChangeEmployee:false,
    //EmpList:"",
    //Employee:"",
    //isStart:false,
    //Manager:"",
    //Period:"",
    //PeriodId:0,
    //SubPeriod:"",
    //TaskCategory:""
  }

  @ViewChild(CalendarComponent) myCalender: CalendarComponent;


  eventSource = [];
  events = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private tasksService: TasksServicesApi) {

    let loader = this.loadingCtrl.create({
      content: "Loading Tasks..."
    });
    loader.present().then(() => {
      this.loadEvents();
    });
    loader.dismiss();
  }
  ///////////////////////////////////
  //////////////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad TasksPage');
  }

  addEvent() {
    let modal = this.modalCtrl.create('AddTaskPage', { selectedDay: this.selectedDay });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        let toast = this.toastCtrl.create({
          message: "Sorry, End date is before start date.",
          duration: 3000,
          position: 'middle'
        });
        let eventData = data;
        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        if (eventData.endTime < eventData.startTime) {
          console.log("NOOOOOOOOOOOOO");
          toast.present();
        }
        else {
          this.events = this.eventSource;
          this.events.push(eventData);
          console.log(" eventData >>> ", eventData)
          this.eventSource = [];
          setTimeout(() => {
            this.eventSource = this.events;

          });
        }
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  changcolor(coll, color) {
    coll.forEach(element => {
      element.styles["background-color"] = color;
    });
  }

  onEventSelected(event) {
    console.log("event >>>", this.event)
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: 'Task: ' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: [
        // {
        //   text: 'Delete',
        //   handler: () => {
        //     let events = this.eventSource;
        //     //remove object by title
        //     let loader = this.loadingCtrl.create({
        //       content: "Deleting Event...."
        //     });
        //     // 
        //     loader.present().then(() => {
        //       this.removeByAttr(events, "title", event.title);
        //       this.eventSource = [];
        //       setTimeout(() => {
        //         this.eventSource = events;
        //       });
        //     });
        //     loader.dismiss();
        //   }
        // },
        {
          text: "Done",
          handler: () => {
            const Sec_modal = this.modalCtrl.create('DoneTaskPage', { Task: event });
            Sec_modal.present();

            Sec_modal.onDidDismiss(data => {
              if (data) {
                let toast = this.toastCtrl.create({
                  message: "Documentations is Added.",
                  duration: 3000,
                  position: 'middle'
                });
                console.log("data back from dismiss :: ", data)
                if (data.Files.length > 0) {
                  toast.present();
                  // let h = this.template.getElementsByClassName('event-detail-container');
                  // this.changcolor(h, this.color);
                }
              }

            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Current event :: ", event);
          }
        }
      ]
    })
    alert.present();
  }

  ///////////////////////
  onTimeSelected(ev) {
    //console.log("EVENT >>>> ", ev);
    this.selectedDay = ev.selectedTime;
  }
  ///
  event: any = {};
  str_time: any;
  end_time: any;
  title_data: string;
  s_dd: any;
  s_mm: any;
  s_yyyy: any;
  e_dd: any;
  e_mm: any;
  e_yyyy: any;
  loadEvents() {
    let emp_id: number = 1054; //static from login id
    this.tasksService.getTasks(emp_id).subscribe((data) => {
      //Working ==> mine 
      data.forEach(ele => {
        console.log("coming ele >>>", ele);
        //stratTime
        this.s_yyyy = moment(ele.StartTime).format('YYYY');
        this.s_mm = moment(ele.StartTime).format('MM');
        this.s_dd = moment(ele.StartTime).format('DD');
        //EndTime
        this.e_yyyy = moment(ele.EndTime).format('YYYY');
        this.e_mm = moment(ele.EndTime).format('MM');
        this.e_dd = moment(ele.EndTime).format('DD');
        ////time should pass in this format otherwise there is a problem --> from documentation
        this.str_time = new Date(Date.UTC(this.s_yyyy, this.s_mm - 1, this.s_dd));
        this.end_time = new Date(Date.UTC(this.e_yyyy, this.e_mm - 1, this.e_dd));
        this.title_data = ele.TaskCategory;
        this.event = { startTime: this.str_time, endTime: this.end_time, allDay: false, title: this.title_data, id: ele.Id };
        this.events = this.eventSource;
        this.events.push(this.event);
      });
      this.eventSource = [];
      setTimeout(() => {
        this.eventSource = this.events;
      });

      //Not Working ==> From the documentation (ionic2-calender)
      //error ==> "cannot read property 'getTime' of undefined in monthview"
      {
        // this.str_time=new Date(Date.UTC(2017, 7)).toString();
        // this.eventSource.push({
        //   title: data[0].TaskCategory,
        //   StartTime: new Date().toISOString(),
        //   endtime: new Date().toISOString(),
        //   allDay: false
        // });
        // this.myCalender.loadEvents();

        // {
      }

    });
  }
  ///////////////////////// function to remove object ( the event ) from eventsource array ////////////////
  ///////////////////////// called in delete button in alert control //////////////////////////////
  ///////////////////////// Not used for now ///////////////////
  removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
}
