import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LeaveServicesApi } from '../../../shared/LeavesService';
import { Storage } from '@ionic/storage';
import { IUser } from "../../../shared/IUser";

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
  public user: IUser;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveService: LeaveServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage, ) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
      }
    });
  }

  ionViewDidLoad() {
    this.CompanyId=this.user.CompanyId;
    var LeavesLoader = this.loadingCtrl.create({
      content: "Loading Leaves..."
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
          })
        }
        else {
          LeavesLoader.dismiss()
        }
      }, (e) => {
        let toast = this.toastCtrl.create({
          message: "Error in getting Leaves, Please Try again later.",
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
