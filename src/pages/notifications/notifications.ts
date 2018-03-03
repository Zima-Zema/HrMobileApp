import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { NotificationDetailsPage } from '../notification-details/notification-details';
import { NotificationServiceApi, INotification, INotifyParams } from "../../shared/NotificationService";
import { Storage } from '@ionic/storage';
import { IUser } from "../../shared/IUser";
import { WelcomePage } from '../welcome/welcome';
import { TranslateService } from "@ngx-translate/core";

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
    Language: "",
    EmpId:0
  }
  user: IUser;
 
  baseUrl: string = "";
  public static notificationsList: Array<INotification> = [];
  public notifications: Array<INotification> = [];
  private start: number = 0;
  errorMsg: string = undefined;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public notifyApi: NotificationServiceApi,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private translationService: TranslateService) {
    
    this.storage.get("BaseURL").then((val) => {
      this.baseUrl = val;
    });
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.notifyParams.UserName = this.user.UserName;
        this.notifyParams.Language = this.user.Language;
        this.notifyParams.CompanyId = this.user.CompanyId;
        this.notifyParams.EmpId = this.user.EmpId;
      }
    });
  }

  ionViewWillEnter() {
    this.errorMsg = undefined;
    this.start = 0;
    var a:any={};
    this.translationService.get('ConnTimeOutErrorMsg').subscribe((data) => {
      a.message = data;
    })

    let loader = this.loadingCtrl.create({
      //content: "Loading...",
      spinner: 'dots'
    });
    loader.present().then(() => {
      NotificationsPage.notificationsList = [];
      this.notifications = [];
      this.notifyApi.getNotifications(this.start, this.notifyParams).subscribe((data) => {
        NotificationsPage.notificationsList = data.value;
        WelcomePage.notificationNumber = NotificationsPage.notificationsList.filter((val) => val.Read == false).length;
        this.notifications = data.value;
        loader.dismiss();
      }, (error) => {
        //this.errorMsg = "Connection TimeOut Please Check Your Internet Connection."
        this.errorMsg= a.message;
        loader.dismiss();
      });
    })
  }

  doInfinite(infiniteScroll: any) {
    this.start += 10;
    this.notifyApi.getNotifications(this.start, this.notifyParams).subscribe((data) => {
      for (let notification of data.value) {
        NotificationsPage.notificationsList.push(notification);
        this.notifications.push(notification);
      }
      infiniteScroll.complete();
    }, (error) => {
      infiniteScroll.enable(error);
    });
  }

  notificationTapped(event, notification) {
    let modal = this.modalCtrl.create(NotificationDetailsPage, notification);
    modal.present();
    modal.onDidDismiss((data) => {
      NotificationsPage.notificationsList.find(n => n.Id == data).Read = true;
      this.notifications.find(n => n.Id == data).Read = true;
      WelcomePage.notificationNumber = NotificationsPage.notificationsList.filter((val) => val.Read == false).length;
    })
  }
}
