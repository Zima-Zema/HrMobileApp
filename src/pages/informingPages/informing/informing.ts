import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { NotificationServiceApi, ILetter, ILetterParams } from "../../../shared/NotificationService";
import { IUser } from '../../../shared/IUser';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
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
    Language: ""
  }
  user: IUser;
  public readed:boolean=true;
  public NotifyFilter: Array<any> = [];
  public notifyData: Array<any> = [];
  public queryText: string;
  public toggled: boolean = false;
  baseUrl: string = "";
  public static notificationsList: Array<ILetter> = [];
  public notifications: Array<ILetter> = [];
  private start: number = 0;
  errorMsg: string = null;
  unReadLetters: number = null;
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
        this.notifyParams.EmpId = this.user.EmpId;
        this.notifyParams.Language = this.user.Language;
        this.notifyParams.CompanyId = this.user.CompanyId;
      }
    });
  }


  ionViewWillEnter() {
    this.errorMsg = undefined;
    this.start = 0;
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
      this.notifyApi.getNotifiyLetters(this.start, this.notifyParams).subscribe((data) => {
        InformingPage.notificationsList = data.value;
        this.unReadLetters = InformingPage.notificationsList.filter((val) => val.read == false).length;
        // this.notifications = data.value;
        this.notifyData = data.value;
        if (this.readed) {
          this.notifications = data.value.filter((notify)=>{
            return notify.read;
          })
        }
        loader.dismiss();
      }, (error) => {
        //this.errorMsg = "Connection TimeOut Please Check Your Internet Connection."
        this.errorMsg = a.message;
        loader.dismiss();
      });
    })
  }

  doInfinite(infiniteScroll: any) {
    this.start += 10;
    this.notifyApi.getNotifiyLetters(this.start, this.notifyParams).subscribe((data) => {
      for (let notification of data.value) {
        InformingPage.notificationsList.push(notification);
        this.notifyData.push(notification);
        if (this.readed) {
          if (notification.read) {
            this.notifications.push(notification);
          }
        }
        else{
          if (!notification.read) {
            this.notifications.push(notification);
          }
        }
        
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

  EditInform(item) {
    console.log(item.Id);
    this.notifyApi.updateLetter(item.Id).subscribe((data) => {
      console.log(data.Id);
      InformingPage.notificationsList.find(n => n.Id == data.Id).read = true;
      this.notifications = this.notifications.filter(n => n.Id != data.Id);
      this.notifyData.find(n => n.Id == data.Id).read = true;
    })
  }
  public toggle(): void {
    this.toggled = this.toggled ? false : true;
  }


  filterItems() {
    console.log("here")
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

  updateList(){
    if (this.readed) {
      this.notifications=[];
      this.notifications = this.notifyData.filter((notify)=>{
        return notify.read;
      })
    }
    else{
      this.notifications=[];
      this.notifications = this.notifyData.filter((notify)=>{
        return !notify.read;
      })
    }

console.log(this.notifications);
  }

}
