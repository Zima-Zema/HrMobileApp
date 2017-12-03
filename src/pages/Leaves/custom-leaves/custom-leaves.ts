import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LeaveServicesApi } from '../../../shared/LeavesService';
import { IUser } from '../../../shared/IUser';
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-custom-leaves',
  templateUrl: 'custom-leaves.html',
})
export class CustomLeavesPage {
  public MainArray: Array<any> = [];
  public CustomHolidaysArr: Array<any> = [];
  public StanderdHolidaysArr: Array<any> = [];
  public CompanyId = 0;
  public HolidaysCount = 0;
  public msg: any = {};
  user: IUser;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveService: LeaveServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private translationService: TranslateService) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.CompanyId = this.user.CompanyId;
      }
    });
  }

  ionViewDidLoad() {
    this.translationService.get('LoadingLeaves').subscribe((data) => {
      this.msg.message = data;
    })
    this.translationService.get('ErrorToasterMsg').subscribe((data) => {
      this.msg.error = data;
    })
    this.CompanyId = this.user.CompanyId;
    var LeavesLoader = this.loadingCtrl.create({
      content: this.msg.message
    });
    LeavesLoader.present().then(() => {
      this.LeaveService.getHolidays(this.CompanyId).subscribe((data) => {
        if (data) {
          LeavesLoader.dismiss().then(() => {
            this.MainArray.push(data);

            this.MainArray.forEach(element => {
              this.CustomHolidaysArr = element.Customs;
              this.StanderdHolidaysArr = this.getDateofStandardDays(element.Standard);
            });
            this.HolidaysCount = this.CustomHolidaysArr.length + this.StanderdHolidaysArr.length;
          })
        }
        else {
          LeavesLoader.dismiss()
        }
      }, (e) => {
        let toast = this.toastCtrl.create({
          message: this.msg.error,
          duration: 3000,
          position: 'middle'
        });
        LeavesLoader.dismiss().then(() => {
          toast.present();
        });
      })
    })


  }

  getDateofStandardDays(calender) {
    let year = new Date().getFullYear();
    let offdays: Array<any> = [];
    calender.forEach((ele) => {
      offdays.push({
        Name: ele.Name,
        Date: new Date(year, ele.SMonth - 1, ele.SDay)
      });

    });
    return offdays;
  }

}
