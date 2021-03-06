import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AddTaskPage } from '../add-task/add-task';
import { TasksServicesApi, ITollen } from '../../../shared/TasksService'
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from "../../../shared/IUser";
import {DoneTaskPage} from '../done-task/done-task';


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
  TollenObj: ITollen = {
    CompanyId: 0,
    Files: [],
    Language: "",
    Source: "EmpTasksForm",
    TaskId: 0,
    FileDetails: []
  }
  lang;
  calendarLocal = "en-GB"
  calendarDir;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  loader_task = this.loadingCtrl.create({
    spinner: 'dots',
    content: ""
  });
  user: IUser;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private tasksService: TasksServicesApi,
    private storage: Storage,
    private translationService: TranslateService) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.TollenObj.CompanyId = this.user.CompanyId;
        this.TollenObj.Language = this.user.Language;
      }
    });
    this.lang = translationService.getDefaultLang();
    if (this.lang === 'ar') {
      this.calendarLocal = "ar-EG";
      this.calendarDir = "rtl"
    }
    else {
      this.calendarLocal = "en-GB";
      this.calendarDir = "ltr"
    }
  }

  ionViewWillLoad() {
  }
  ionViewWillEnter() {

    let a: any = {};
    this.translationService.get('loadTasks').subscribe((data) => {
      a.cont = data;
    })

    this.loader_task.setContent(a.cont);
    this.loader_task.present().then(() => {
      this.loadEvents();
    });
  }
  ///////////////////////////////////////
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {

    let a: any = {};
    this.translationService.get('DoneTasksMsg').subscribe((data) => {
      a.message = data;
    })
    this.translationService.get('TaskTitle').subscribe((data) => {
      a.title = data;
    })
    this.translationService.get('TaskForm').subscribe((data) => {
      a.from = data;
    })
    this.translationService.get('TaskTo').subscribe((data) => {
      a.to = data;
    })
    this.translationService.get('DoneTask').subscribe((data) => {
      a.DoneT = data;
    })
    this.translationService.get('DoneTaskLoader').subscribe((data) => {
      a.DoneTLoad = data;
    })
    this.translationService.get('IsDoneTask').subscribe((data) => {
      a.IsDoneT = data;
    })
    this.translationService.get('ErrorDoneTask').subscribe((data) => {
      a.ErrorDone = data;
    })
    this.translationService.get('ErrorAddDocu').subscribe((data) => {
      a.ErrorDocument = data;
    })
    this.translationService.get('AddDocu').subscribe((data) => {
      a.AddDocument = data;
    })

    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    const Sec_modal = this.modalCtrl.create(DoneTaskPage, { Task: event });
    let finish_toast = this.toastCtrl.create({
      message: a.message,
      duration: 3000,
      position: 'bottom',
      cssClass: "suc_toast.scss"
    });
    let alert = this.alertCtrl.create({
      title: a.title + event.title,
      subTitle: a.from + start + '<br>'+ a.to + end,
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
          text: a.DoneT,
          handler: () => {
            var Done_Loader = this.loadingCtrl.create({
              content: a.DoneTLoad 
            });
            if (event.Stat == 1) {
              this.TollenObj.TaskId = event.id;
              Done_Loader.present().then(() => {
                this.tasksService.saveData(this.TollenObj).subscribe((data) => {
                  event.title = event.title + a.IsDoneT;
                  event.Stat = 2;
                  Done_Loader.dismiss();
                  this.loadEvents();
                })
              }).catch((err: Error) => {
                Done_Loader.dismiss();
                let err_toast = this.toastCtrl.create({
                  message: a.ErrorDone,
                  duration: 3000,
                  position: 'middle'
                });
                err_toast.present();
              })
            }
            else {
              finish_toast.present();
            }
          }
        }
        , {
          text: "Attachments",
          handler: () => {
            if (event.Stat == 1) {
              let err_toast = this.toastCtrl.create({
                message: a.ErrorDocument,
                duration: 3000,
                position: 'middle'
              });
              Sec_modal.present();
              Sec_modal.onDidDismiss((data) => {
                if (data) {
                  event.title = event.title + "  is Done";
                  event.Stat = 2;
                  if (data.Files.length > 0) {
                    let suc_toast = this.toastCtrl.create({
                      message: a.AddDocument,
                      duration: 3000,
                      position: 'bottom',
                    });
                    suc_toast.present();
                    this.loadEvents();
                  }
                  else {
                    err_toast.present();
                  }
                }
                else {
                  err_toast.present();
                }
              });
            }
            else {
              finish_toast.present();
            }
          }
        }
      ]
    })
    alert.present();
  }
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }
  loadEvents() {

    let a: any = {};
    this.translationService.get('IsDoneTask').subscribe((data) => {
      a.IsDoneT = data;
    })
    this.translationService.get('NoTask').subscribe((data) => {
      a.notask = data;
    })
    this.translationService.get('ErrorGetTask').subscribe((data) => {
      a.errorGetTask = data;
    })


    this.eventSource = [];
    let emp_id: number;
    emp_id = this.user.EmpId;
    this.tasksService.getTasks(emp_id).subscribe((data) => {
      if (data) {
        //Working ==> By Fatma 
        data.forEach(ele => {
          //stratTime  : sperate to get each of year , month and day
          this.s_yyyy = moment(ele.StartTime).format('YYYY');
          this.s_mm = moment(ele.StartTime).format('MM');
          this.s_dd = moment(ele.StartTime).format('DD');
          //EndTime  : sperate to get each of year , month and day
          this.e_yyyy = moment(ele.EndTime).format('YYYY');
          this.e_mm = moment(ele.EndTime).format('MM');
          this.e_dd = moment(ele.EndTime).format('DD');
          ////time should pass in this format (UTC) otherwise there is a problem --> from documentation (ionic2-calender)
          this.str_time = new Date(Date.UTC(this.s_yyyy, this.s_mm - 1, this.s_dd, 0, 0, 0, 0));
          this.end_time = new Date(Date.UTC(this.e_yyyy, this.e_mm - 1, this.e_dd, 0, 0, 0, 0));
          if (ele.Status == 1) { this.title_data = ele.TaskCategory; }
          else { this.title_data = ele.TaskCategory + a.IsDoneT; }
          this.event = { startTime: this.str_time, endTime: this.end_time, allDay: false, title: this.title_data, id: ele.Id, Stat: ele.Status, desc: ele.Description };
          this.events = this.eventSource;
          this.events.push(this.event);
        });
        this.eventSource = [];
        this.loader_task.dismiss();
        setTimeout(() => {
          this.eventSource = this.events;
        });
      }
      else {
        let err_toast = this.toastCtrl.create({
          message: a.notask,
          duration: 2000,
          position: 'middle'
        });
        this.loader_task.dismiss().then(() => { err_toast.present() });
      }
    }, (e) => {
      let toast = this.toastCtrl.create({
        message: a.errorGetTask,
        duration: 3000,
        position: 'middle'
      });
      this.loader_task.dismiss().then(() => {
        toast.present();
      });
    });
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
  // var doc = document.querySelectorAll('.event-detail');
  // var arr_doc = Array.from(doc);
  // var filter_doc = [...arr_doc].filter(el => el.innerHTML.indexOf(event.title));
  // filter_doc[0].parentElement.parentElement.parentElement.parentElement.style.backgroundColor = "lemonchiffon";
}
