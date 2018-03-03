import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { NotificationServiceApi, ILetter, ILetterParams, INotifyParams } from "../../../shared/NotificationService";
import { IUser } from '../../../shared/IUser';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { WelcomePage } from '../../welcome/welcome';
/**
 * Generated class for the InformingPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */

@IonicPage()
@Component({
  selector: 'page-informing',
  templateUrl: 'informing.html'
})
export class InformingPage {

  receivedRoot = 'ReceivedPage'
  notreceivedRoot = 'NotreceivedPage'
  shownItem = null;
  flag: boolean;
  notifyParams: ILetterParams = {
    EmpId: 0,
    CompanyId: 0,
    Language: "",
    ReadParam:false
  }
  user: IUser;
  public readed: boolean = false;
  public NotifyFilter: Array<any> = [];
  public notifyData: Array<any> = [];
  public queryText: string;
  public toggled: boolean = false;
  baseUrl: string = "";
  public static notificationsList: Array<ILetter> = [];
  public notifications: Array<ILetter> = [];
  private start: number = 0;
  errorMsg: string = null;
  notifyParamObj: INotifyParams = {
    UserName: "",
    CompanyId: 0,
    Language: "",
    EmpId: 0
  }
  constructor(
    public navCtrl: NavController,
    public notifyApi: NotificationServiceApi,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private translationService: TranslateService
  ) {
    this.storage.get("BaseURL").then((val) => {
      this.baseUrl = val;
    });
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.notifyParams.EmpId = this.notifyParamObj.EmpId = this.user.EmpId;
        this.notifyParamObj.UserName = this.user.UserName;
        this.notifyParams.Language = this.notifyParamObj.Language = this.user.Language;
        this.notifyParams.CompanyId = this.notifyParamObj.CompanyId = this.user.CompanyId;
      }
    });
  }
  ionViewDidLoad() {

  }

  getSomeLetters(start,params){
    this.errorMsg = undefined;
    var a: any = {};
    this.translationService.get('ConnTimeOutErrorMsg').subscribe((data) => {
      a.message = data;
    })
    let loader = this.loadingCtrl.create({
      //content: "Loading...",
      spinner: 'dots'
    });
    loader.present().then(() => {
      InformingPage.notificationsList = [];
      this.notifications = [];

      this.notifyApi.getNotifiyLetters(start, params).subscribe((data) => {
        loader.dismiss();
        
        InformingPage.notificationsList = data.value;
        this.notifyData = data.value;
        for (let notification of data.value) {
          if (this.readed) {
            if (notification.read) {
              this.notifications.push(notification);
            }
          }
          else {
            if (!notification.read) {
              this.notifications.push(notification);
            }
          }
        }
      }, (error) => {
        //this.errorMsg = "Connection TimeOut Please Check Your Internet Connection."
        this.errorMsg = a.message;
        loader.dismiss();
      });
    });
  }

  ionViewWillEnter() {
    this.readed = false;
    this.notifyApi.getNotificationCount(this.notifyParamObj).subscribe((data) => {
      WelcomePage.notificationNumber = data.NotifyCount;
      WelcomePage.lettersNumber = data.LetterCount;

    }, (err) => {
    });

    this.start = 0;
    this.notifyParams.ReadParam = this.readed;
    this.getSomeLetters(this.start,this.notifyParams);


  }

  doInfinite(infiniteScroll: any) {

    this.start += 10;
    this.notifyApi.getNotifiyLetters(this.start, this.notifyParams).subscribe((data) => {
      //this.unReadLetters += InformingPage.notificationsList.filter((val) => val.read == false).length;
      for (let notification of data.value) {
        InformingPage.notificationsList.push(notification);
        this.notifyData.push(notification);
        this.notifications.push(notification);
      }
      infiniteScroll.complete();
    }, (error) => {
      infiniteScroll.enable(error);
    });
  }

  toggleItem(item) {
    if (this.isItemShown(item)) {
      this.shownItem = null;
    } else {
      this.shownItem = item;
    }
  };
  isItemShown(item) {
    return this.shownItem === item;
  };
  public getSome: boolean = true;

  EditInform(item) {

    this.notifyApi.updateLetter(item.Id).subscribe((data) => {
      InformingPage.notificationsList.find(n => n.Id == data.Id).read = true;
      InformingPage.notificationsList.find(n => n.Id == data.Id).Readdatetime = data.ReadTime;
      this.notifications = this.notifications.filter(n => n.Id != data.Id);
      this.notifyData.find(n => n.Id == data.Id).read = true;
      this.notifyData.find(n => n.Id == data.Id).Readdatetime = data.ReadTime;

      if (WelcomePage.lettersNumber !== 0) {
        WelcomePage.lettersNumber = WelcomePage.lettersNumber - 1;
      }
    })

    this.start += 10;
    this.notifyParams.ReadParam=this.readed;
    this.notifyApi.getNotifiyLetters(this.start, this.notifyParams).subscribe((data) => {
      if (data.value.length > 0) {
        for (let notification of data.value) {
          InformingPage.notificationsList.push(notification);
          this.notifyData.push(notification);
          this.notifications.push(notification);
        }
      }
    }, (error) => {

    });

  }
  public toggle(): void {
    this.toggled = this.toggled ? false : true;
  }


  filterItems() {
    this.notifications = [];
    let val = this.queryText.toLowerCase();
    this.NotifyFilter = this.notifyData.filter((v) => {
      if (v.NotifySource) {
        if ((v.NotifySource + '').toLowerCase().startsWith(val)) {
          return true;
        }
        return false;
      }
    });
    this.notifications = this.NotifyFilter;
    //this.AssignOrderCount = this.AssignOrderArr.length;
    this.NotifyFilter = [];
  }

  updateList() {
    if (this.readed) {
      this.notifications = [];
      this.notifyParams.ReadParam = this.readed;
      this.start = 0;
      console.log("true",this.notifyParams);
      this.getSomeLetters(this.start,this.notifyParams);

      this.notifications = _.orderBy(this.notifications, ['Readdatetime', 'ReadTime'], ['desc', 'desc'])
    }
    else {
      this.notifications = [];
      this.notifyParams.ReadParam = this.readed
      this.start = 0;
      console.log("false",this.notifyParams);
      
      this.getSomeLetters(this.start,this.notifyParams);
      //_.sortBy(this.notifications,[['NotifyDate']])
    }

   
  }

}
