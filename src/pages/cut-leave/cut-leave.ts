import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeaveServicesApi, IRequestData } from "../../shared/LeavesService"
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-cut-leave',
  templateUrl: 'cut-leave.html',
})

export class CutLeavePage {
  public LeaveComing: any;
  CutLeaveForm: FormGroup;
  //
  public ReturnDate: any;
  public minDate = new Date();
  public filteredArr;
  public localDateval = new Date();
  public pickFormat: any;
  public displayFormat: any;
  public ActualendDate: any;
  public NofDaysAfter:number;
  public balAfter:number;

  RequestDataObj: IRequestData = {
    CompanyId: 0,
    TypeId: 1067,
    Culture: "ar-EG",
    EmpId: 1072,
    RequestId: 0,
    StartDate: ""
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder) {
    //
    this.LeaveComing = this.navParams.data;
    console.log("coming Data : ", this.LeaveComing);
    //
    this.CutLeaveForm = this.formBuilder.group({
      ReturnDate: ['', Validators.required],
      ActualendDate:[''],
      NofDaysAfter:[''],
      balAfter:['']
    });
    //
    this.ReturnDate = this.bloodyIsoString(new Date(this.LeaveComing.ReturnDate));
    this.pickFormat = 'MMM DD YYYY';
    this.displayFormat = "MMM DD, YYYY ";
    //
    this.RequestDataObj.TypeId = this.LeaveComing.TypeId;
    this.RequestDataObj.StartDate = new Date().toDateString();
    this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
      console.log("GetRequestLeaveData : ", data)
      this.filteredArr = this.LeaveServices.getOffDays(data.Calender);
      this.localDateval = new Date();
      this.localDateval = this.LeaveServices.getInitialDate(this.localDateval, data.Calender)
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

  dateChange(item) {
    console.log(` dateChange item : ${item}`)
    if (item) {
      this.ReturnDate = this.bloodyIsoString(new Date(new Date(item).toDateString())).slice(0, -15);
      console.log("dateChange", this.ReturnDate);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CutLeavePage');
  }

  CutLeaves() {
    console.log("Cut")
  }

}
