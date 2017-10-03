import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-leave-edit',
  templateUrl: 'leave-edit.html',
})
export class LeaveEditPage {
  public item: any;
  public minDate: any;
  public YearsArr: Array<number> = [];
  public yearsValue: Array<number> = [];
  //form
  public EditLeaveForm: FormGroup;
  public startDate: any;
  public noOfDays: any;
  public allowedDays: number = 0;
  public reservedDays: number = 0;
  public returnDate: any;
  public endDate: any;
  public balBefore: number = 0;
  public balAfter: number = 0;
  public replacement: any;
  public comments: any;
  public reason: any;
  public fraction: any;
  //minimum value for startdatepicker of startdate

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder) {
    this.yearsValue = this.GetYears();
    this.item = this.navParams.data;
    console.log("item : ", this.item);
    let SDate=new Date( this.item.StartDate);
    this.minDate = this.bloodyIsoString(SDate);

    this.EditLeaveForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      noOfDays: ['', Validators.required]
    });

  }


  bloodyIsoString(bloodyDate: Date) {

    let tzo = -bloodyDate.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num) {
        let norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return bloodyDate.getFullYear() +
      '-' + pad(bloodyDate.getMonth() + 1) +
      '-' + pad(bloodyDate.getDate()) +
      'T' + pad(bloodyDate.getHours()) +
      ':' + pad(bloodyDate.getMinutes()) +
      ':' + pad(bloodyDate.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }
  //
  GetYears() {
    let year = new Date().getFullYear();
    console.log("year : ", year)
    console.log("year : ", year + 100)
    for (let i = year; i <= year + 100; i++) {
      this.YearsArr.push(i);
    }
    return this.YearsArr;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveEditPage');
  }

}
