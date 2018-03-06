import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
//
import { NotificationServiceApi, INotifyParams, INotification } from '../../shared/NotificationService';
import { SignalR } from 'ng2-signalr';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LogInPage } from '../log-in/log-in';
import { Storage } from '@ionic/storage';
import { IUser } from "../../shared/IUser";
//import { LeaveListPage } from '../leave-list/leave-list';
import { TranslateService } from '@ngx-translate/core';
import { BackgroundMode } from '@ionic-native/background-mode';
//import { AssignOrderPage} from '../AssignOrder/assign-order/assign-order';
//import { AssignOrderRequestsPage} from '../AssignOrderRequests/assign-order-requests/assign-order-requests';
//Tabs
import { ChartsPage } from '../ExternalTabs/charts/charts';
import { RequestsPage } from '../ExternalTabs/requests/requests';
import { QuereiesPage } from '../ExternalTabs/quereies/quereies';
import { SettingsTabPage } from '../ExternalTabs/settings-tab/settings-tab';
import { InformingPage } from '../informingPages/informing/informing';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  public ChartTab: any;
  public RequestsTab: any;
  public QuereiesTab: any;
  public SettingTab: any;
  public notifyTab: any;
  public letterTab: any;
  //
  tabsColor: string = "newBlueGreen";
  tabsMode: string = "md";
  tabsPlacement: string = "top";
  //
  tabToShow: Array<boolean> = [true, true, true, true, true, true, true, true, true];
  scrollableTabsopts: any = {};
  //
  public user_name: string = "";
  public user_email: string = "";
  notifyParams: INotifyParams = {
    UserName: "",
    CompanyId: 0,
    Language: "",
    EmpId: 0
  }
  public static notificationNumber: number = null;
  public static lettersNumber: number = null;
  user: IUser;
  menuDir;
  lang;
  baseUrl: string = "";
  get notificationNumber() {
    if (WelcomePage.notificationNumber != 0 && WelcomePage.notificationNumber != null) {
      return WelcomePage.notificationNumber;
    }
    return null;
  }
  get lettersNumber() {
    if (WelcomePage.lettersNumber != 0 && WelcomePage.lettersNumber != null) {
      return WelcomePage.lettersNumber;
    }
    return null;
  }
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public notifyApi: NotificationServiceApi,
    private signalr: SignalR,
    public localNotifications: LocalNotifications,
    private storage: Storage,
    public translate: TranslateService,
    private backgroundMode: BackgroundMode,
  ) {
    this.ChartTab = ChartsPage;
    this.RequestsTab = RequestsPage;
    this.QuereiesTab = QuereiesPage;
    this.SettingTab = SettingsTabPage;
    this.notifyTab = NotificationsPage;
    this.letterTab = InformingPage;
    this.platform.registerBackButtonAction((event) => {
      if (this.navCtrl.length() <= 1) {
        this.backgroundMode.moveToBackground();
      }
    });

    this.lang = translate.getDefaultLang();
    if (this.lang === 'ar') {
      this.menuDir = "right";
    }
    else {
      this.menuDir = "left";
    }
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.notifyParams.UserName = this.user.UserName;
        this.notifyParams.Language = this.user.Language;
        this.notifyParams.CompanyId = this.user.CompanyId;
        this.notifyParams.EmpId = this.user.EmpId;
        this.user_name = udata.UserName;
        this.user_email = udata.Email;
        //this.translate.setDefaultLang(this.user.Language.slice(0, -3));
      }
      this.storage.get('BaseURL').then((val) => {
        this.baseUrl = val;
        this.signalr.connect({
          url: val,
        }).then((connection) => {
          connection.listenFor('AppendMessage').subscribe((message: INotification) => {
            WelcomePage.notificationNumber++;
            this.localNotifications.registerPermission().then((grant) => {
              this.localNotifications.schedule({
                id: message.Id,
                text: message.Message,
                at: new Date().getTime(),
                led: 'FF0000',
                title: message.From,
                icon: '' + this.baseUrl + 'SpecialData/Photos/' + this.user.CompanyId + '/' + message.PicUrl + '?dummy=1503580792563',
                data: message
              });

            })
          });
        });
      })
      this.localNotifications.on('click', (data) => {
        this.navCtrl.push(NotificationsPage);
      });

    });
  }

  ionViewWillEnter() {

    if ((WelcomePage.notificationNumber < 0 || WelcomePage.notificationNumber == null) || (WelcomePage.lettersNumber < 0 || WelcomePage.lettersNumber == null)) {
      this.notifyApi.getNotificationCount(this.notifyParams).subscribe((data) => {
        WelcomePage.notificationNumber = data.NotifyCount;
        WelcomePage.lettersNumber = data.LetterCount;
      }, (err) => {
      });
    }

  }

  refreshScrollbarTabs() {
    this.scrollableTabsopts = { refresh: true };
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
  // GoToTasks() {
  //   this.navCtrl.push(TasksPage);
  // }
  // GoToLeaveList() {
  //   this.navCtrl.push(LeaveListPage);
  // }
  // Settings() {
  //   this.navCtrl.push(SettingsPage);
  // }
  // GoToAssignOrder(){
  //   this.navCtrl.push(AssignOrderPage);
  // }
  // GoToAssignOrderRequests(){
  //   this.navCtrl.push(AssignOrderRequestsPage);
  // }
  Logout() {
    this.storage.clear();
    this.navCtrl.setRoot(LogInPage);
    this.navCtrl.popToRoot();
  }
}
