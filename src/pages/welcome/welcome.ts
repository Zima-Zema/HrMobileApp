import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import { TasksPage } from '../tasks/tasks';
import { NotificationServiceApi, INotifyParams, INotification } from '../../shared/NotificationService';
import { SignalR } from 'ng2-signalr';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NotificationDetailsPage } from '../notification-details/notification-details';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  notifyParams: INotifyParams = {
    UserName: "Bravo",
    CompanyId: 2,
    Language: "en-GB"
  }
  public static notificationNumber: number = 0;
  baseUrl: string = "http://www.enterprise-hr.com/";
  get notificationNumber() {
    return WelcomePage.notificationNumber;
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public notifyApi: NotificationServiceApi, private signalr: SignalR, public localNotifications: LocalNotifications) {




  }

  ionViewWillEnter() {
    // if(WelcomePage.notificationNumber)
    this.notifyApi.getNotificationCount(this.notifyParams).subscribe((data) => {
      console.log("Notification Number>>>", data);
      WelcomePage.notificationNumber = data;
      console.log("WelcomePage.notificationNumber>>>", WelcomePage.notificationNumber);
    }, (err) => {
      console.log("WelcomePage.notificationNumber Error>>>", err);
    });


    console.log('ionViewDidLoad WelcomePage');
    this.signalr.connect().then((connection) => {
      console.log("connection>>>", connection);
      connection.listenFor('AppendMessage').subscribe((message:INotification) => {
        console.log("the message>>>", message);
        WelcomePage.notificationNumber++;
        this.localNotifications.schedule({
          id:message.Id,
          text:message.Message,
          title:message.From,
          icon:''+this.baseUrl+'SpecialData/Photos/0/'+message.PicUrl+'?dummy=1503580792563',
          data:message
        });

      });
    });

    this.localNotifications.on('click',(data)=>{
      this.navCtrl.push(NotificationDetailsPage,data);
    });

  }

  ionViewDidLoad() {

  }
  ////////////////////////////
  GoToHome() {
    //this.navCtrl.push(WelcomePage);
    //this.navCtrl.setRoot(WelcomePage);
    this.navCtrl.popToRoot();
  }
  GoToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }
  GoToTasks() {
    this.navCtrl.push(TasksPage);
  }
}
