import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationsPage} from '../notifications/notifications';
import { TasksPage} from '../tasks/tasks';
import { NotificationServiceApi,INotifyParams} from '../../shared/NotificationService';
import {SignalR, BroadcastEventListener} from 'ng2-signalr';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  notifyParams:INotifyParams = {
    UserName:"seham",
    CompanyId:0,
    Language:"en-GB"
  }
  public static notificationNumber:number=0;
  get notificationNumber(){
    return WelcomePage.notificationNumber;
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public notifyApi:NotificationServiceApi, private signalr:SignalR) {

    this.notifyApi.getNotificationCount(this.notifyParams).subscribe((data)=>{
      console.log("Notification Number>>>",data);
      WelcomePage.notificationNumber=data;
      console.log("WelcomePage.notificationNumber>>>",WelcomePage.notificationNumber);
    },(err)=>{
      console.log("WelcomePage.notificationNumber>>>",WelcomePage.notificationNumber);
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
    this.signalr.connect().then((connection)=>{
      console.log("connection>>>",connection);
      connection.listenFor('AppendMessage').subscribe((message)=>{
        console.log("the message>>>",message);
        WelcomePage.notificationNumber++;

      });
    });
  }
////////////////////////////
GoToHome(){
  this.navCtrl.push(WelcomePage);
}
GoToNotifications(){
  this.navCtrl.push(NotificationsPage);
}
GoToTasks(){
  this.navCtrl.push(TasksPage);
}
}
