import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, Platform } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { Storage } from '@ionic/storage';
import { IUser } from "../../shared/IUser";
import { NotificationServiceApi, IUpdateNotification, INotification } from "../../shared/NotificationService";
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-notification-details',
  templateUrl: 'notification-details.html',
})
export class NotificationDetailsPage {


  updateObj: IUpdateNotification = {
    CompanyId: 0,
    Culture: "",
    UserName: "",
    Id: 0
  }
  user: IUser;
  notify: INotification;
  baseUrl: string = "http://www.enterprise-hr.com/";
  notifyDate: any;
  notifyTime: any;
  notifySubject: any;
  notifyMsg: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public notifyApi: NotificationServiceApi,
    public viewCtrl: ViewController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private platform: Platform) {

    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.updateObj.UserName = this.user.UserName;
        this.updateObj.Culture = this.user.Culture;
        this.updateObj.CompanyId = this.user.CompanyId;
      }
      this.notify = this.navParams.data;
      console.log("this.notify :: ", this.notify);
      this.updateObj.Id = this.notify.Id;
      this.notifyTime = (moment(this.notify.SentDate).format('LT'));
      this.notifyDate = moment(this.notify.SentDate).format('LL');
      this.notifySubject = this.notify.From;
      this.notifyMsg = this.notify.Message;
      if (this.notify.Read == false) {
        this.notifyApi.updateNotification(this.updateObj).subscribe((data) => {
          console.log("updateNotification");
          WelcomePage.notificationNumber--;
        })
      }

    });
  }


  ionViewWillEnter() {

  }
  ionViewDidLoad() {

  }
  dismiss() {
    this.viewCtrl.dismiss(this.notify.Id);
  }

}
