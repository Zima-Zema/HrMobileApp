import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LeaveServicesApi } from '../../../shared/LeavesService';
<<<<<<< HEAD
import { Storage } from '@ionic/storage';
import { IUser } from "../../../shared/IUser";

=======
import { IUser } from '../../../shared/IUser';
import { Storage } from '@ionic/storage';
>>>>>>> 87281cc5785d6f459a5789cee3c1910fed3366d7
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
<<<<<<< HEAD
  public user: IUser;

=======
  public HolidaysCount = 0;
  user: IUser;
>>>>>>> 87281cc5785d6f459a5789cee3c1910fed3366d7
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveService: LeaveServicesApi,
    public loadingCtrl: LoadingController,
<<<<<<< HEAD
    public toastCtrl: ToastController,
    private storage: Storage, ) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
=======
    public toastCtrl: ToastController, private storage: Storage) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.CompanyId = this.user.CompanyId;

>>>>>>> 87281cc5785d6f459a5789cee3c1910fed3366d7
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
            this.HolidaysCount = this.CustomHolidaysArr.length + this.StanderdHolidaysArr.length;
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
