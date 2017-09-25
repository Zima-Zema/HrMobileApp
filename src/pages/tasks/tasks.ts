import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AddTaskPage } from '../add-task/add-task';
import { DoneTaskPage } from '../done-task/done-task';
import { TasksServicesApi, ITasks } from '../../shared/TasksService'
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
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
  eventSource = [];
  events = [];
  viewTitle: string;
  selectedDay = new Date();
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
  }
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  loader_task = this.loadingCtrl.create({
    content: "Loading Tasks..."
  });
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private tasksService: TasksServicesApi,
    private storage: Storage) {
  }
  ionViewWillLoad() {
    this.loader_task.present().then(() => {
      this.loadEvents();
    });
  }
  /////////////////////////// Not Used for now //////////////////////
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
          toast.present();
        }
        else {
          this.events = this.eventSource;
          this.events.push(eventData);
          this.eventSource = [];
          setTimeout(() => {
            this.eventSource = this.events;
          });
        }
      }
    });
  }
  ///////////////////////////////////////
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    console.log("event  ", event);
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    let alert = this.alertCtrl.create({
      title: 'Task: ' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: [
        // {
        ///////////////////////////////////////// Delete event from array // Not Used for now  //////////////////////////////////
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
            if (event.Stat == 1) {
              const Sec_modal = this.modalCtrl.create('DoneTaskPage', { Task: event });
              Sec_modal.present();
              Sec_modal.onDidDismiss(data => {
                if (data) {
                  console.log("data back from dismiss :: ", data)
                  if (data.Files.length > 0) {
                    let suc_toast = this.toastCtrl.create({
                      message: "Documentations is Added.",
                      duration: 3000,
                      position: 'bottom',
                      cssClass:"suc_toast.scss"
                    });
                    // var doc = document.querySelectorAll('.event-detail');
                    // var arr_doc = Array.from(doc);
                    // var filter_doc = [...arr_doc].filter(el => el.innerHTML.indexOf(event.title));
                    // filter_doc[0].parentElement.parentElement.parentElement.parentElement.style.backgroundColor = "lemonchiffon";
                    suc_toast.present();
                    this.loadEvents();
                  }
                  else {
                    let err_toast = this.toastCtrl.create({
                      message: "Sorry, No Documentations is Added.",
                      duration: 3000,
                      position: 'middle'
                    });
                    err_toast.present();
                  }
                }

              });
            }
            else {
              let err_toast = this.toastCtrl.create({
                message: "this task is already done!",
                duration: 3000,
                position: 'middle'
              });
              err_toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    })
    alert.present();
  }
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }
  loadEvents() {
    this.eventSource = [];
    let emp_id: number;
<<<<<<< HEAD
    //  let user: any = this.storage.get("User").then((user) => {
    //if (user) {
    //emp_id = user.EmpId;
=======
    // let user: any = this.storage.get("User").then((user) => {
    // if (user) {
    //  emp_id = user.EmpId;
>>>>>>> 80b320b69f0baf680e754135d014f3b86ce70c47
    emp_id = 1;
    this.tasksService.getTasks(emp_id).subscribe((data) => {
      if (data) {
        //Working ==> By Fatma 
        data.forEach(ele => {
          console.log("coming ele >>>", ele);
          //stratTime  : sperate to get each of year , month and day
          this.s_yyyy = moment(ele.StartTime).format('YYYY');
          this.s_mm = moment(ele.StartTime).format('MM');
          this.s_dd = moment(ele.StartTime).format('DD');
          //EndTime  : sperate to get each of year , month and day
          this.e_yyyy = moment(ele.EndTime).format('YYYY');
          this.e_mm = moment(ele.EndTime).format('MM');
          this.e_dd = moment(ele.EndTime).format('DD');
          ////time should pass in this format (UTC) otherwise there is a problem --> from documentation (ionic2-calender)
          this.str_time = new Date(Date.UTC(this.s_yyyy, this.s_mm - 1, this.s_dd));
          this.end_time = new Date(Date.UTC(this.e_yyyy, this.e_mm - 1, this.e_dd));
          this.title_data = ele.TaskCategory;
          this.event = { startTime: this.str_time, endTime: this.end_time, allDay: false, title: this.title_data, id: ele.Id, Stat: ele.Status, desc: ele.Description };
          this.events = this.eventSource;
          if (this.event.Stat == 1) {
            this.events.push(this.event);
          }
        });
        this.eventSource = [];
        this.loader_task.dismiss();
        setTimeout(() => {
          this.eventSource = this.events;
        });
<<<<<<< HEAD
=======
      }
      else {
        let err_toast = this.toastCtrl.create({
          message: "There is no tasks...",
          duration: 2000,
          position: 'middle'
        });
        err_toast.present();
>>>>>>> 80b320b69f0baf680e754135d014f3b86ce70c47
      }
      else {
        let toast = this.toastCtrl.create({
          message: "There is no tasks...",
          duration: 2000,
          position: 'middle'
        });
        toast.present();
      }
    }, (e) => {
      let toast = this.toastCtrl.create({
        message: "Error in getting tasks, Please Try again later.",
        duration: 3000,
        position: 'middle'
      });
      this.loader_task.dismiss().then(() => {
        toast.present();
      });
    });
<<<<<<< HEAD
    //   }
    // }, (err) => {
    //   let toast = this.toastCtrl.create({
    //     message: "There is an error, Please Try again later.",
    //     duration: 3000,
    //     position: 'middle'
    //   });
    //   this.loader_task.dismiss().then(() => {
    //     toast.present();
    //   });
    // });
=======
    // }
    //});
>>>>>>> 80b320b69f0baf680e754135d014f3b86ce70c47
  }
  ///////////////////////// function to remove object ( the event ) from eventsource array ////////////////
  ///////////////////////// called in delete button in alert control // Not used for now //////////////////////////////
  removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
  ///////////////////////////////
  markDisable = (date) => {
    console.log(date);
  };
  /////////////////////////
  public getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days: Array<Date> = [];
    var spac_days: Array<Date> = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));

      date.setDate(date.getDate() + 1);
    }
    days.forEach(element => {
      if (element.getDay() == 6 || element.getDay() == 5) {
        spac_days.push(element);
      }
    });
    //console.log("days  ", days);
    // console.log("spac_days  ", spac_days);
    return spac_days;
  }
}
