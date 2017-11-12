import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { AssignOrderServicesApi, IEmpAssignOrders, ISpacificLeaves } from '../../../shared/AssignOrderService';
import { LeaveServicesApi, IRequestType } from "../../../shared/LeavesService";
import { Storage } from '@ionic/storage';
import { IUser } from '../../../shared/IUser';
import * as _ from "lodash";

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
  public LeavesData: Array<any> = [];
  public filteredExpiryDate: Array<any> = [];
  //Forms
  public AssignOrderForm: FormGroup;
  public AssignDate: any;
  public CalculMethodSelect: any;
  public pickFormat: string;
  public displayFormat: string;
  public minDate:any;
  public minExpiryDate:any;
  //Data
  public localDateval: any = new Date();
  public isDisabled: boolean;

  //Objects
  public user: IUser;
  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 1042,
    Culture: "ar-EG",
    CompanyId: 0
  }
  public SpacificLeaves: ISpacificLeaves = {
    Culture: "ar-EG",
    CompanyId: 0
  }
  public RequestTypeObj: IRequestType = {
    CompId: 0,
    Culture: "",
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

    this.isDisabled = true;
    this.minDate=new Date();
    //this.minExpiryDate=this.AssignDate();

    this.AssignOrderForm = this.formBuilder.group({
      Employee: ['', Validators.required],
      Duration: ['', Validators.required],
      AssignDate: ['', Validators.required],
      // CalculMethod: ['', Validators.required],
      CalculMethodSelect: [''],
      leaveType: [''],
      ExpiryDate: [''],
      comments: ['']
    });

    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
      }
    });

    var OrdersLoader = this.loadingCtrl.create({
      content: "Loading Orders..."
    });

    OrdersLoader.present().then(() => {
      this.AssignOrderService.GetEmployeeForManger(this.EmpAssignOrderObj).subscribe((data) => {
        if (data) {
          OrdersLoader.dismiss().then(() => {
            console.log("emps : ", data);
            this.EmployeeData = data;
          });
        }
        else {
          OrdersLoader.dismiss();
        }
      }, (e) => {
        let toast = this.toastCtrl.create({
          message: "Error in getting Orders, Please Try again later.",
          duration: 3000,
          position: 'middle'
        });
        OrdersLoader.dismiss().then(() => {
          toast.present();
        });
      })
    })


  }//end of constructor

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAssignOrderPage');
  }

  CalculMethodChange(cal) {
    if (cal == 2) {
      this.AssignOrderService.GetSpacificLeaves(this.SpacificLeaves).subscribe((data) => {
        console.log("Leaves : ", data);
        this.LeavesData = data;
      })
    }
  }

  DurationChange(Dur) {
    console.log("DurationChange : ", Dur);
    if (Dur == 1) {
      this.LeaveServices.getHolidays(this.user.CompanyId).subscribe((data) => {
        this.MainArray.push(data);
        this.MainArray.forEach(element => {
          var AllDays: Array<Date> = this.getAllDays();
          var OffDays: Array<Date> = this.getOffDays(element);
         // var Pervious: Array<Date> = this.getPerviousDate();
         // console.log("Pervious : ", Pervious)
          var result = AllDays.filter(function (ele) {
            var try1 = OffDays.map(Number).indexOf(+ele);
            if (try1 == -1) { return ele; }
          })

         // var finalResult=_.union(Pervious,result)
          this.filteredArr = result;
        });
      })
    }

  }

  AssignDateChange(AssignDate) {
    console.log("Ass : ", AssignDate)
    this.AssignDate = new Date(AssignDate).toDateString();
    //this.localDateval = new Date(AssignDate).toDateString();
  }

  // CalculMethodChange(cal) {
  //   if(cal==true){this.CalculMethodSelect=1;}
  //   else{this.CalculMethodSelect=2; }
  // }

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

  // getPerviousDate() {
  //   let today = new Date(new Date().setHours(0, 0, 0, 0)); //today
  //   let year = today.getFullYear();
  //   let offdays: Array<any> = [];
  //   for (let month = 1; month <= today.getMonth() + 1; month++) {
  //     let tdays:any;
  //     if (month < today.getMonth() + 1) {
  //       tdays = new Date(year, month, 0).getDate();
  //       console.log("tdays : ",tdays)
  //     }
  //     else if (month == today.getMonth() + 1) {
  //       tdays = new Date(year, month, today.getDate()-1).getDate();
  //       console.log("tdays : ",tdays)
  //     }
  //     for (let date = 1; date <= tdays; date++) {
  //       let day = new Date();
  //       day.setDate(date);
  //       day.setMonth(month - 1);
  //       day.setFullYear(year);
  //       day.setHours(0, 0, 0, 0);
  //       console.log("Day ::: ",day);
  //       offdays.push(day);
  //     }
  //   }
  //   return offdays;
  // }







}
