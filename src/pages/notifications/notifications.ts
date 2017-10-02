import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { NotificationDetailsPage } from '../notification-details/notification-details';
import { NotificationServiceApi, INotification, INotifyParams } from "../../shared/NotificationService";
import { Storage } from '@ionic/storage';
import { IUser } from "../../shared/IUser";


@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  flag: boolean;
  notifyParams: INotifyParams = {
    UserName: "",
    CompanyId: 0,
    Language: ""
  }
  user: IUser;
  //http://localhost:36207/SpecialData/Photos/0/1054.jpeg?dummy=1503580792563
  baseUrl: string = "http://www.enterprise-hr.com/";
  notifications: Array<INotification> = [];
  private start: number = 0;
  errorMsg: string = undefined;
  constructor(public navCtrl: NavController, public navParams: NavParams, public notifyApi: NotificationServiceApi, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private storage: Storage) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.notifyParams.UserName = this.user.UserName;
        this.notifyParams.Language = this.user.Language;
        this.notifyParams.CompanyId = this.user.CompanyId;
      }

    });


  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
    this.errorMsg = undefined;
    this.start = 0;
    console.log('ionViewWillEnter NotificationsPage');
    let loader = this.loadingCtrl.create({
      content: "Loading...",
    });
    loader.present().then(() => {
      this.notifications = [];
      this.notifyApi.getNotifications(this.start, this.notifyParams).subscribe((data) => {
        this.notifications = data.value;
        loader.dismiss();
        //this.flag=false;
        // if (this.start < 10) {
        //   this.storage.set("topNotify", data.value);
        // }
        // for (let notification of data.value) {
        //   this.notifications.push(notification);
        // }
      }, (error) => {
        console.log("error in notification", error);
        this.errorMsg = "Connection TimeOut Please Check Your Internet Connection."
        loader.dismiss();
        // this.notifications=[];
        // this.flag=true;
        // this.storage.get("topNotify").then((data) => {
        //   for (let notification of data) {
        //     this.notifications.push(notification);
        //   }
        // })
      });


    })

  }

  doInfinite(infiniteScroll: any) {
    console.log("doInfinite, start is currently>>>", this.start);
    this.start += 10;
    this.notifyApi.getNotifications(this.start, this.notifyParams).subscribe((data) => {

      // if (this.start < 10) {
      //   this.storage.set("topNotify", data.value);
      // }
      console.log("Notification List>>>", data.value);
      // if(this.flag == true){
      //   this.notifications=[];
      //   this.flag=false;
      // }
      for (let notification of data.value) {
        this.notifications.push(notification);
      }

      infiniteScroll.complete();

    }, (error) => {
      console.log("error in notification", error);
      infiniteScroll.enable(error);
      // this.notifications=[];
      // this.storage.get("topNotify").then((data) => {
      //   for (let notification of data) {
      //     this.notifications.push(notification);
      //   }
      // })
    });

  }
  /////////////////////////////////////////
  notificationTapped(event, notification) {
    // let modal = this.modalCtrl.create(NotificationDetailsPage, notification);
    // modal.present();
    // modal.onDidDismiss((data) => {
    //   console.log("ModalReturn", data);
    //   this.notifications.find(n => n.Id == data).Read = true;
    // })
    this.notifications.find(n => n.Id == notification.Id).Read = true;
    this.navCtrl.push(NotificationDetailsPage, notification);
    

  }

}
