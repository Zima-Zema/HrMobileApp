import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { NotificationServiceApi, IUpdateNotification, INotification } from "../../shared/NotificationService";
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-notification-details',
  templateUrl: 'notification-details.html',
})
export class NotificationDetailsPage {


  updateObj: IUpdateNotification = {
    CompanyId: 2,
    Culture: "en-GB",
    UserName: "Bravo",
    Id: 0
  }
  notify: INotification;
  baseUrl: string = "http://www.enterprise-hr.com/";
  notifyDate: any
  notifyTime: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public notifyApi: NotificationServiceApi, public viewCtrl:ViewController) {
    this.notify = this.navParams.data
    console.log("this.notify :: ", this.notify);
    this.updateObj.Id = this.notify.Id;
    this.notifyTime = (moment(this.notify.SentDate).format('LT'));
    this.notifyDate = moment(this.notify.SentDate).format('LL');
    if (this.notify.Read == false) {
      this.notifyApi.updateNotification(this.updateObj).subscribe((data) => {
        console.log("updateNotification");
        WelcomePage.notificationNumber--;
      })
    }


    //WelcomePage.notificationNumber--;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationDetailsPage');

  }
  dismiss(){
    this.viewCtrl.dismiss(this.notify.Id);
  }

}
