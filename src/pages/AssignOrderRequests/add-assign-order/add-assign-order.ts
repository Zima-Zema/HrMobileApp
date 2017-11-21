import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AssignOrderServicesApi, IEmpAssignOrders, ISpacificLeaves, IAssignOrderVM, IEmpAssignDates } from '../../../shared/AssignOrderService';
import { LeaveServicesApi, IRequestType } from "../../../shared/LeavesService";
import { Storage } from '@ionic/storage';
import { IUser } from '../../../shared/IUser';
import * as _ from "lodash";
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-add-assign-order',
  templateUrl: 'add-assign-order.html',
})
export class AddAssignOrderPage {
  //Arrays
  public MainArray: Array<any> = [];
  public EmployeeData: Array<any> = [];
  public filteredArr: Array<any> = [];
  public DurationArr: Array<any> = [];
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
  public maxDate: any;
  public minExpiryDate: any;

  //Data
  public localDateval: any = new Date();
  public ExpiryDatelocalDateval: any;
  static leaveType: any;
  //Toast 
  public toast = this.toastCtrl.create({
    message: "There is an error, Please try again later.",
    duration: 3000,
    position: 'middle'
  });
  //Objects
  public user: IUser;
  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 0, //1042
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

  public GetEmpAssignOrderObj: IEmpAssignDates = {
    CompanyId: 0,
    EmpId: 0
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public AssignOrderService: AssignOrderServicesApi,
    public LeaveServices: LeaveServicesApi,
    private storage: Storage) {

    this.minDate = new Date();
    let max = moment(this.minDate).add(1, 'years').calendar();
    this.maxDate = new Date(max);

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
  }//end of constructor

  ionViewDidLoad() {
    var OrdersLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    this.EmpAssignOrderObj.EmpId = this.user.EmpId;
    this.EmpAssignOrderObj.CompanyId = this.user.CompanyId;
    this.EmpAssignOrderObj.Culture = this.user.Culture;
    OrdersLoader.present().then(() => {
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
    })
  }

  EmployeeChange(EmpId) {
    var EmployeesLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    this.filteredArr = [];
    this.Duration = null;
    this.AssignDate = null;
    this.Description = null;
    this.GetEmpAssignOrderObj.CompanyId = this.user.CompanyId;
    this.GetEmpAssignOrderObj.EmpId = EmpId;
    EmployeesLoader.present().then(() => {
      this.AssignOrderService.getEmpAssignDates(this.GetEmpAssignOrderObj).subscribe((data) => {
        EmployeesLoader.dismiss().then(() => {
          data.forEach(element => {
            this.filteredArr.push(new Date(element));
          });
        })
      }, (e) => {
        EmployeesLoader.dismiss().then(() => {
          this.toast.present();
        })
      })
    })
  }

  DurationChange(Dur) {
    var HolidaysLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    if (Dur == 1) {
      this.AssignDate = null;
      HolidaysLoader.present().then(() => {
        // get all holidays
        this.LeaveServices.getHolidays(this.user.CompanyId).subscribe((data) => {
          HolidaysLoader.dismiss().then(() => {
            this.MainArray = [];
            this.MainArray.push(data);
            this.MainArray.forEach(element => {
              var AllDays: Array<Date> = this.getAllDays();
              var OffDays: Array<Date> = this.getOffDays(element);
              var result = AllDays.filter(function (ele) {
                var try1 = OffDays.map(Number).indexOf(+ele);
                if (try1 == -1) { return ele; }
              })
              this.DurationArr = result;
              this.DurationArr.forEach(element => {
                this.filteredArr.push(element)
              });
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
      if (this.filteredArr.length > 0 && this.DurationArr.length > 0) {
        var HQData = this.filteredArr.filter(ele => {
          if (this.DurationArr.indexOf(ele) == -1) {
            return ele;
          }
        });
        this.filteredArr = [];
        HQData.forEach(element => {
          this.filteredArr.push(element)
        });
      }
    }
  }

  AssignDateChange(AssignDate) {
    this.AssignDate = this.bloodyIsoString(AssignDate);
    this.ExpiryDate = null;
    this.minExpiryDate = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
    this.ExpiryDatelocalDateval = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
    if (this.Employee == null) {
      this.AssignOrderForm.controls['Employee'].markAsTouched({ onlySelf: true });
      this.AssignOrderForm.controls['Employee'].markAsDirty({ onlySelf: true });
    }
    if (this.Duration == null) {
      this.AssignOrderForm.controls['Duration'].markAsTouched({ onlySelf: true });
      this.AssignOrderForm.controls['Duration'].markAsDirty({ onlySelf: true });
    }
  }

  CalculMethodChange(cal) {
    var LeavesLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    if (cal == 2) {
      this.minExpiryDate = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
      this.ExpiryDatelocalDateval = new Date(new Date(new Date(this.AssignDate).getTime() + (24 * 60 * 60 * 1000)).setHours(0, 0));
      this.SpacificLeaves.CompanyId = this.user.CompanyId;
      this.SpacificLeaves.Culture = this.user.Culture;
      LeavesLoader.present().then(() => {
        this.AssignOrderService.GetSpacificLeaves(this.SpacificLeaves).subscribe((data) => {
          LeavesLoader.dismiss().then(() => {
            this.LeavesData = data;
          })

        }, (e) => {
          LeavesLoader.dismiss().then(() => {
            this.toast.present();
          })
        });
      })

      this.AssignOrderForm.controls['leaveType'].enable();
      this.AssignOrderForm.controls['leaveType'].setValidators([AddAssignOrderPage.isRequired]);
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

  AssignDateCancel(AssignDate) {
    if (AssignDate == null || AssignDate == "") {
      this.AssignOrderForm.controls['AssignDate'].markAsTouched({ onlySelf: true });
      this.AssignOrderForm.controls['AssignDate'].markAsDirty({ onlySelf: true });
    }
    if (this.Employee == null) {
      this.AssignOrderForm.controls['Employee'].markAsTouched({ onlySelf: true });
      this.AssignOrderForm.controls['Employee'].markAsDirty({ onlySelf: true });
    }
    if (this.Duration == null) {
      this.AssignOrderForm.controls['Duration'].markAsTouched({ onlySelf: true });
      this.AssignOrderForm.controls['Duration'].markAsDirty({ onlySelf: true });
    }

  }

  ExpiryDateChange(ExpiryDate) {
    this.ExpiryDate = this.bloodyIsoString(ExpiryDate);
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

      // default:
      //   break;
    }

  }

  static isRequired(control: FormControl) {
    if (control.value == null || control.value == "") {
      return {
        "required": "Required"
      }
    }
  }

  saveAssignOrder() {

    let AddAssignOrderLoader = this.loadingCtrl.create({
      content: "Adding Assign Order..."
    });
    let EditErrorToast = this.toastCtrl.create({
      message: "Error in Adding Assign Order, Please Try again later.",
      duration: 3000,
      position: 'middle'
    });
    let EditSuccessToast = this.toastCtrl.create({
      message: 'Assign Order is added successfully.',
      duration: 2000,
      position: 'bottom'
    });

    this.AssignOrderObj.EmpId = Number.parseInt(this.Employee);
    this.AssignOrderObj.Duration = Number.parseFloat(this.Duration);
    this.AssignOrderObj.AssignDate = this.AssignDate;
    this.AssignOrderObj.CalcMethod = Number.parseInt(this.CalculMethodSelect);
    this.AssignOrderObj.LeaveTypeId = this.leaveType;
    this.AssignOrderObj.ExpiryDate = this.ExpiryDate;
    this.AssignOrderObj.TaskDesc = this.Description;
    this.AssignOrderObj.CompanyId = this.user.CompanyId;
    this.AssignOrderObj.Language = this.user.Culture;
    this.AssignOrderObj.ManagerId = this.user.EmpId;
    this.AssignOrderObj.Id = 0;
    AddAssignOrderLoader.present().then(() => {
      this.AssignOrderService.PostAssignOrder(this.AssignOrderObj).subscribe((data) => {
        AddAssignOrderLoader.dismiss().then(() => {
          EditSuccessToast.present();
          this.ResetForm();
        })
      }, (e: Error) => {
        AddAssignOrderLoader.dismiss().then(() => {
          EditErrorToast.present();
        })
      })
    })
  }

  ResetForm() {
    this.Employee = "";
    this.Duration = "";
    this.AssignDate = "";
    this.CalculMethodSelect = "";
    this.leaveType = "";
    this.ExpiryDate = "";
    this.Description = "";
  }

  getOffDays(calender) {
    let year = new Date().getFullYear();
    let offdays: Array<any> = [];
    calender.Customs.forEach(element => {
      offdays.push(new Date(element.HoliDate));
    });
    calender.Standard.forEach((ele) => {
      offdays.push(new Date(year, ele.SMonth - 1, ele.SDay));
      offdays.push(new Date(year + 1, ele.SMonth - 1, ele.SDay))
    })
    for (let oneYear = year; oneYear <= year + 1; oneYear++) {
      for (let month = 1; month <= 12; month++) {
        let tdays = new Date(oneYear, month, 0).getDate();
        for (let date = 1; date <= tdays; date++) {
          let day
          if (tdays === 31) {
            day = new Date("1/1/" + oneYear);
          }
          else {
            day = new Date();
          }
          day.setDate(date);
          day.setMonth(month - 1);
          day.setFullYear(oneYear);
          day.setHours(0, 0, 0, 0)

          if (day.getDay() == calender.weeKend1 || day.getDay() == calender.weekend2) {
            offdays.push(day);
          }
        }
      }
    }
    return offdays;
  }

  getAllDays() {
    let year = new Date().getFullYear();
    let alldays: Array<any> = [];
    for (let oneYear = year; oneYear <= year + 1; oneYear++) {
      for (let month = 1; month <= 12; month++) {
        let tdays = new Date(oneYear, month, 0).getDate();

        for (let date = 1; date <= tdays; date++) {
          let day
          if (tdays === 31) {
            day = new Date("1/1/" + oneYear);
          }
          else {
            day = new Date();
          }
          day.setDate(date);
          day.setMonth(month - 1);
          day.setFullYear(oneYear);
          day.setHours(0, 0, 0, 0);
          alldays.push(day);
        }
      }
    }
    return alldays;
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

  // getPerviousDate() {
  //   let today = new Date(new Date().setHours(0, 0, 0, 0)); //today
  //   let year = today.getFullYear();
  //   let offdays: Array<any> = [];
  //   for (let month = 1; month <= today.getMonth() + 1; month++) {
  //     let tdays:any;
  //     if (month < today.getMonth() + 1) {
  //       tdays = new Date(year, month, 0).getDate();
  //     }
  //     else if (month == today.getMonth() + 1) {
  //       tdays = new Date(year, month, today.getDate()-1).getDate();
  //     }
  //     for (let date = 1; date <= tdays; date++) {
  //       let day = new Date();
  //       day.setDate(date);
  //       day.setMonth(month - 1);
  //       day.setFullYear(year);
  //       day.setHours(0, 0, 0, 0);
  //       offdays.push(day);
  //     }
  //   }
  //   return offdays;
  // }

}
