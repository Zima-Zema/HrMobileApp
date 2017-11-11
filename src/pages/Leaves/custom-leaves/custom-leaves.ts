import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeaveServicesApi } from '../../../shared/LeavesService';
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveService: LeaveServicesApi) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomLeavesPage');

    this.LeaveService.getHolidays(this.CompanyId).subscribe((data) => {
      this.MainArray.push(data);
      console.log("MainArray : ", this.MainArray)
      //this.StanderdHolidaysArr = this.getDateofStandardDays(data);
      //console.log("this.StanderdHolidaysArr : ",this.StanderdHolidaysArr)
      this.MainArray.forEach(element => {
        this.CustomHolidaysArr = element.Customs;
        this.StanderdHolidaysArr = this.getDateofStandardDays(element.Standard);
        console.log("Customs", element.Customs);
        console.log("Standard", this.StanderdHolidaysArr);
      });
    })
  }

  getDateofStandardDays(calender) {
    let year = new Date().getFullYear();
    console.log("year : ",year);
    console.log("calender : ",calender)
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
