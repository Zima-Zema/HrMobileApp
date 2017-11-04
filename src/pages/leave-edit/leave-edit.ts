import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IValidationMsg, IValidate, IRequestData, LeaveServicesApi } from '../../shared/LeavesService';

@IonicPage()
@Component({
  selector: 'page-leave-edit',
  templateUrl: 'leave-edit.html',
})
export class LeaveEditPage {
  comingLeave: any;

  //ngModel
  public actualStartDate: any;
  public actualNOfDays: any;
  public actualReturnDate: any;
  public actualEndDate: any;

  //
  //object to transmit
  errorMsgObj: IValidationMsg = {
    AssignError: null,
    DeptPercentError: null,
    HasRequestError: null,
    IsError: false,
    IsReplacementError: null,
    percentage: null,
    ReplacmentError: null,
    Stars: 0,
    StarsError: null,
    WaitingError: null,
    WaitingMonth: null
  }
  //
  validateObj: IValidate = {
    Id: 0,
    TypeId: 0,
    CompanyId: 0,
    Culture: "",
    EmpId: 0,
    EndDate: "",
    StartDate: null,
    ReplaceEmpId: 0,
  }
  //
  RequestDataObj: IRequestData = {
    CompanyId: 0,
    TypeId: 1067,
    Culture: "ar-EG",
    EmpId: 1072,
    RequestId: 0,
    StartDate: ""
  }
  ////
  //utilits
  public pickFormat: any;
  public displayFormat: any;
  public calender: any;
  public leaveType: any;
  public filteredArr;
  public localDateval;
  public minDate = new Date();
  public rate;
  //
  public EditLeaveForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveServices: LeaveServicesApi,
    private formBuilder: FormBuilder) {

    this.comingLeave = this.navParams.data;
    this.actualNOfDays = this.comingLeave.NofDays;

    console.log("item : ", this.comingLeave);
    this.EditLeaveForm = this.formBuilder.group({
      actualStartDate: ['', Validators.required],
      actualNOfDays: [''],
      actualEndDate: [''],
      actualReturnDate: ['']

    });
    this.errorMsgObj.IsError = false;
    //
    this.pickFormat = 'MMM DD YYYY';
    this.displayFormat = "MMM DD, YYYY ";
    //
    this.RequestDataObj.TypeId = this.comingLeave.TypeId;
    this.RequestDataObj.StartDate = new Date().toDateString();
    this.LeaveServices.GetRequestLeaveData(this.RequestDataObj).subscribe((data) => {
      console.log("GetRequestLeaveData : ", data)
      this.calender = data.Calender;
      this.leaveType = data.LeaveType;
      this.filteredArr = this.LeaveServices.getOffDays(data.Calender);
      this.localDateval = new Date();
      this.localDateval = this.LeaveServices.getInitialDate(this.localDateval, data.Calender)
    });
  }

  //
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveEditPage');
  }

  dateChange(newStartDate) {
    console.log("new", newStartDate);
    this.actualStartDate = this.bloodyIsoString(new Date(new Date(newStartDate).toDateString())).slice(0, -15);
    console.log("actual", this.actualStartDate);
    this.bindForm();

  }
  bindForm() {
    if (this.actualStartDate && this.actualNOfDays) {
      let res = this.LeaveServices.calcDates(this.actualStartDate, this.actualNOfDays, this.calender, this.leaveType, 0);
      this.actualEndDate = new Date(res.endDate).toISOString();
      this.actualReturnDate = new Date(res.returnDate).toISOString();
      this.validateObj.Id = this.comingLeave.Id ? this.comingLeave.Id : 0;
      this.validateObj.CompanyId = 0;
      this.validateObj.Culture = "ar-EG";
      this.validateObj.EmpId = 1072;
      this.validateObj.EndDate = new Date(new Date(this.actualEndDate).toString()).toISOString().slice(0, -1);
      this.validateObj.StartDate = new Date(new Date(this.actualStartDate).toString()).toISOString().slice(0, -1);
      this.validateObj.ReplaceEmpId = this.comingLeave.ReplaceEmpId;
      this.validateObj.TypeId = this.comingLeave.TypeId;
      console.log("this.validateObj: ", this.validateObj);
      if (this.actualEndDate) {
        this.LeaveServices.validateRequest(this.validateObj).subscribe((data) => {
          this.errorMsgObj = null;
          this.errorMsgObj = data;
          this.rate = this.errorMsgObj.Stars;
          console.log(this.errorMsgObj);
        })
      }
    }
  }

  UpdateLeaves() {

  }

}
