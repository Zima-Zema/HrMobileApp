import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { AssignOrderServicesApi, IEmpAssignOrders, ISpacificLeaves, IAssignOrderVM } from '../../../shared/AssignOrderService';
import { LeaveServicesApi, IRequestType } from "../../../shared/LeavesService";
import { Storage } from '@ionic/storage';
import { IUser } from '../../../shared/IUser';
import * as _ from "lodash";
import { AssignOrderRequestsPage } from '../assign-order-requests/assign-order-requests'

@IonicPage()
@Component({
  selector: 'page-edit-assign-order',
  templateUrl: 'edit-assign-order.html',
})
export class EditAssignOrderPage {
  public ComingAssign: any;
  //Arrays
  public MainArray: Array<any> = [];
  public EmployeeData: Array<any> = [];
  public filteredArr: Array<any> = [];
  public LeavesData: Array<any> = [];
  public filteredExpiryDate: Array<any> = [];
  //Forms
  public AssignOrderForm: FormGroup;
  public AssignDate: any;
  public ExpiryDate: any;
  public leaveType: any;
  public Duration: any;
  public Employee: any;
  public Description: string;
  public CalculMethodSelect: any;
  public pickFormat: string;
  public displayFormat: string;
  public minDate: any;
  public minExpiryDate: any;
  //Data
  public localDateval: any;
  public ExpiryDatelocalDateval: any;
  static leaveType: any;
  public IsChanged: boolean;

  //toast
  public toast = this.toastCtrl.create({
    message: "There is an error, Please try again later.",
    duration: 3000,
    position: 'middle'
  });

  //Objects
  public user: IUser;
  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 0,
    Culture: "",
    CompanyId: 0
  }
  public SpacificLeaves: ISpacificLeaves = {
    Culture: "",
    CompanyId: 0
  }
  public AssignOrderObj: IAssignOrderVM = {
    AssignDate: null,
    CalcMethod: 0,
    CompanyId: 0,
    Duration: 0,
    EmpId: 0,
    ExpiryDate: null,
    Id: 0,
    Language: "",
    LeaveTypeId: 0,
    ManagerId: 0,
    TaskDesc: ""
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public AssignOrderService: AssignOrderServicesApi,
    public LeaveServices: LeaveServicesApi,
    private storage: Storage) {

    this.ComingAssign = this.navParams.data;
    console.log("Coming Assign : ", this.ComingAssign);

    this.minDate = new Date();
    this.localDateval = new Date(this.ComingAssign.AssignDate);
    this.IsChanged = false;

    this.AssignOrderForm = this.formBuilder.group({
      Employee: ['', Validators.required],
      Duration: ['', Validators.required],
      AssignDate: ['', Validators.required],
      CalculMethodSelect: ['', Validators.required],
      leaveType: [''],
      ExpiryDate: [''],
      Description: ['']
    });

    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
      }
    });

    var OrdersLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    this.EmpAssignOrderObj.EmpId = this.user.EmpId;
    this.EmpAssignOrderObj.Culture = this.user.Culture;
    this.EmpAssignOrderObj.CompanyId = this.user.CompanyId;
    OrdersLoader.present().then(() => {
      //Loading Employees
      this.AssignOrderService.GetEmployeeForManger(this.EmpAssignOrderObj).subscribe((data) => {
        if (data) {
          OrdersLoader.dismiss().then(() => {
            this.EmployeeData = data;
          });
        }
        else {
          OrdersLoader.dismiss();
        }
      }, (e) => {
        OrdersLoader.dismiss().then(() => {
          this.toast.present();
        });
      })
      if (this.CalculMethodSelect == 2) {
        //Loading Leaves
        this.minExpiryDate = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
        this.ExpiryDatelocalDateval = new Date(this.ComingAssign.ExpiryDate);
      }
      this.SpacificLeaves.CompanyId=this.user.CompanyId;
      this.SpacificLeaves.Culture=this.user.Culture;
      this.AssignOrderService.GetSpacificLeaves(this.SpacificLeaves).subscribe((data) => {
        this.LeavesData = data;
      });
      //  }
    })// end of order loader

  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.Employee = this.ComingAssign.EmpId;
    this.Duration = this.ComingAssign.Duration;
    this.DurationChange(this.Duration);
    this.IsChanged = false;
    this.AssignDate = this.ComingAssign.AssignDate;
    this.CalculMethodSelect = this.ComingAssign.CalcMethod;
    if (this.CalculMethodSelect == 2) {
      this.leaveType = this.ComingAssign.LeaveTypeId;
      this.ExpiryDate = this.ComingAssign.ExpiryDate;
    }
    else {
      this.leaveType = null;
      this.ExpiryDate = null;
    }
    this.Description = this.ComingAssign.TaskDesc;
  }

  CalculMethodChange(cal) {
    this.IsChanged = true;
    if (cal == 2) {
      this.ExpiryDatelocalDateval = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
      this.minExpiryDate = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
      //
      this.AssignOrderForm.controls['leaveType'].enable();
      this.AssignOrderForm.controls['leaveType'].setValidators([EditAssignOrderPage.isRequired]);
      this.AssignOrderForm.controls['leaveType'].updateValueAndValidity();
      this.AssignOrderForm.controls['leaveType'].markAsDirty({ onlySelf: true });
    }
    else {
      this.leaveType = null;
      this.ExpiryDate = null;
      this.AssignOrderForm.controls['leaveType'].disable();
      this.AssignOrderForm.controls['leaveType'].clearValidators();
    }
  }

  DurationChange(Dur) {
    this.IsChanged = true;
    var HolidaysLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    if (Dur == 1) {
      this.AssignDate = null;
      HolidaysLoader.present().then(() => {
        this.LeaveServices.getHolidays(this.user.CompanyId).subscribe((data) => {
          HolidaysLoader.dismiss().then(() => {
            this.MainArray.push(data);
            this.MainArray.forEach(element => {
              var AllDays: Array<Date> = this.getAllDays();
              var OffDays: Array<Date> = this.getOffDays(element);
              var result = AllDays.filter(function (ele) {
                var try1 = OffDays.map(Number).indexOf(+ele);
                if (try1 == -1) { return ele; }
              })
              this.filteredArr = result;
            });
          })
        }, (e) => {
          HolidaysLoader.dismiss().then(() => {
            this.toast.present();
          })
        })
      })
    }
    else {
      this.filteredArr = null;
    }
  }

  AssignDateChange(AssignDate) {
    this.IsChanged = true;
    this.AssignDate = this.bloodyIsoString(AssignDate);
    this.ExpiryDate = "";
    this.minExpiryDate = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
    this.ExpiryDatelocalDateval = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
  }

  AssignDateCancel(AssignDate) {
    if (AssignDate == null || AssignDate == "") {
      this.AssignOrderForm.controls['AssignDate'].markAsTouched({ onlySelf: true });
      this.AssignOrderForm.controls['AssignDate'].markAsDirty({ onlySelf: true });
      if (this.AssignDate == null) {
        this.AssignOrderForm.controls['Employee'].markAsTouched({ onlySelf: true });
        this.AssignOrderForm.controls['Employee'].markAsDirty({ onlySelf: true });
      }
      if (this.Duration == null) {
        this.AssignOrderForm.controls['Duration'].markAsTouched({ onlySelf: true });
        this.AssignOrderForm.controls['Duration'].markAsDirty({ onlySelf: true });
      }
    }
  }

  ExpiryDateChange(ExpiryDate) {
    this.ExpiryDate = this.bloodyIsoString(ExpiryDate);
    this.IsChanged = true;
  }

  EmployeeChange(item) {
    this.IsChanged = true;
  }

  leaveTypeChange(item) {
    this.IsChanged = true;
  }

  DescriptionChange(item) {
    this.IsChanged = true;
  }

  InputBlur(item) {
    switch (item) {
      case 'Emp':
        this.AssignOrderForm.controls['Employee'].markAsTouched({ onlySelf: true });
        this.AssignOrderForm.controls['Employee'].markAsDirty({ onlySelf: true });
        break;
      case 'Dur':
        this.AssignOrderForm.controls['Duration'].markAsTouched({ onlySelf: true });
        this.AssignOrderForm.controls['Duration'].markAsDirty({ onlySelf: true });
        if (this.AssignDate == null) {
          this.AssignOrderForm.controls['Employee'].markAsTouched({ onlySelf: true });
          this.AssignOrderForm.controls['Employee'].markAsDirty({ onlySelf: true });
        }
        break;
      case 'calcuMethod':
        this.AssignOrderForm.controls['CalculMethodSelect'].markAsTouched({ onlySelf: true });
        this.AssignOrderForm.controls['CalculMethodSelect'].markAsDirty({ onlySelf: true });
        if (this.AssignDate == null) {
          this.AssignOrderForm.controls['Employee'].markAsTouched({ onlySelf: true });
          this.AssignOrderForm.controls['Employee'].markAsDirty({ onlySelf: true });
        }
        if (this.Duration == null) {
          this.AssignOrderForm.controls['Duration'].markAsTouched({ onlySelf: true });
          this.AssignOrderForm.controls['Duration'].markAsDirty({ onlySelf: true });
        }
        if (this.AssignDate == null) {
          this.AssignOrderForm.controls['AssignDate'].markAsTouched({ onlySelf: true });
          this.AssignOrderForm.controls['AssignDate'].markAsDirty({ onlySelf: true });
        }
        break;
    }

  }

  static isRequired(control: FormControl) {
    if (control.value == null || control.value == "") {
      return {
        "required": "Required"
      }
    }
  }

  UpdateAssignOrder() {
    let EditAssignOrderLoader = this.loadingCtrl.create({
      content: "Editing Assign Order..."
    });
    let EditErrorToast = this.toastCtrl.create({
      message: "Error in Editing Assign Order, Please Try again later.",
      duration: 3000,
      position: 'middle'
    });
    let EditSuccessToast = this.toastCtrl.create({
      message: 'Assign Order is edited successfully.',
      duration: 2000,
      position: 'bottom'
    });

    this.AssignOrderObj.EmpId = Number.parseInt(this.Employee);
    this.AssignOrderObj.Duration = Number.parseFloat(this.Duration);
    this.AssignOrderObj.AssignDate = this.AssignDate;
    this.AssignOrderObj.CalcMethod = Number.parseInt(this.CalculMethodSelect);
    this.AssignOrderObj.LeaveTypeId = Number.parseInt(this.leaveType);
    this.AssignOrderObj.ExpiryDate = this.ExpiryDate;
    this.AssignOrderObj.TaskDesc = this.Description;
    this.AssignOrderObj.CompanyId = this.user.CompanyId;
    this.AssignOrderObj.Language = this.user.Culture;
    this.AssignOrderObj.ManagerId = this.user.EmpId;
    this.AssignOrderObj.Id = this.ComingAssign.Id;

    EditAssignOrderLoader.present().then(() => {
      this.AssignOrderService.editAssignOrder(this.AssignOrderObj).subscribe((data) => {
        AssignOrderRequestsPage.AssignOrderList = AssignOrderRequestsPage.AssignOrderList.filter((ele) => ele.Id !== this.ComingAssign.Id);
        console.log("AssignOrderRequestsPage.AssignOrderList : ", AssignOrderRequestsPage.AssignOrderList)
        data.LeaveType = this.LeavesData.find(ele => ele.id === this.AssignOrderObj.LeaveTypeId).name;
        data.Employee = this.EmployeeData.find(ele => ele.id === this.AssignOrderObj.EmpId).name;
        data.ApprovalStatus = 2;
        AssignOrderRequestsPage.AssignOrderList.push(data)
        EditAssignOrderLoader.dismiss().then(() => {
          EditSuccessToast.present();
          this.navCtrl.pop();
        })
      }, (e) => {
        EditAssignOrderLoader.dismiss().then(() => {
          EditErrorToast.present();
        })
      })
    })

  }


  getOffDays(calender) {
    let year = new Date().getFullYear();
    let offdays: Array<any> = [];
    calender.Customs.forEach(element => {
      offdays.push(new Date(element.HoliDate));
    });
    calender.Standard.forEach((ele) => {
      offdays.push(new Date(year, ele.SMonth - 1, ele.SDay))
    })
    for (let month = 1; month <= 12; month++) {
      let tdays = new Date(year, month, 0).getDate();
      for (let date = 1; date <= tdays; date++) {
        let day = new Date();
        day.setDate(date);
        day.setMonth(month - 1);
        day.setFullYear(year);
        day.setHours(0, 0, 0, 0)

        if (day.getDay() == calender.weeKend1 || day.getDay() == calender.weekend2) {
          offdays.push(day);
        }
      }
    }
    return offdays;
  }

  getAllDays() {
    let year = new Date().getFullYear();
    let offdays: Array<any> = [];
    for (let month = 1; month <= 12; month++) {
      let tdays = new Date(year, month, 0).getDate();
      for (let date = 1; date <= tdays; date++) {
        let day = new Date();
        day.setDate(date);
        day.setMonth(month - 1);
        day.setFullYear(year);
        day.setHours(0, 0, 0, 0);
        offdays.push(day);
      }
    }
    return offdays;
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

}
