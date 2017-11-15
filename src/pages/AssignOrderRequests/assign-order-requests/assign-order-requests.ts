import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { ShowAssignOrderRequestsPage } from '../show-assign-order-requests/show-assign-order-requests';
import { AddAssignOrderPage } from '../add-assign-order/add-assign-order';
import { AssignOrderServicesApi, IEmpAssignOrders, IDeleteRequest, IAssignOrderVM } from '../../../shared/AssignOrderService';
import * as _ from 'lodash';
import { IUser } from '../../../shared/IUser';
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import { EditAssignOrderPage } from '../edit-assign-order/edit-assign-order';

@IonicPage()
@Component({
  selector: 'page-assign-order-requests',
  templateUrl: 'assign-order-requests.html',
})
export class AssignOrderRequestsPage {

  public toggled: boolean = false;
  public static AssignOrderList: Array<any> = [];
  public AssignOrderArr: Array<any> = [];
  public AssignOrderFilter: Array<any> = [];
  public AssignOrderData: Array<any> = [];
  public AssignOrderCount: number;
  public queryText: string;
  public SortedName: string;
  isManager: boolean;

  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 0,
    Culture: "ar-EG",
    CompanyId: 0
  }
  public user: IUser;
  public DeleteRequestObj: IDeleteRequest =
  {
    Id: 0,
    Language: ""
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
    public AssignOrderService: AssignOrderServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private translationService: TranslateService) {
    this.SortedName = 'Id';
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.isManager = (this.user.Roles.indexOf("Manager") == -1) ? false : true;
      }
    });
  }


  ionViewDidLoad() {

    this.EmpAssignOrderObj.EmpId = 1072;
    //this.user.EmpId;
    var OrdersLoader = this.loadingCtrl.create({
      content: "Loading Orders..."
    });
    OrdersLoader.present().then(() => {
      this.AssignOrderService.GetMangersAssignOrders(this.EmpAssignOrderObj).subscribe((data) => {
        if (data) {
          OrdersLoader.dismiss().then(() => {
            this.AssignOrderCount = data.length;
            AssignOrderRequestsPage.AssignOrderList = data;
            this.AssignOrderData = data;
            this.AssignOrderArr = data;
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
  }


  ionViewWillEnter() {
    this.toggled = false;
    console.log("AssignOrderList : ", AssignOrderRequestsPage.AssignOrderList);
    this.AssignOrderArr = AssignOrderRequestsPage.AssignOrderList;
    // if (AssignOrderRequestsPage.AssignOrderList) {
    //   console.log("inside");
    //   var ele = this.AssignOrderArr.filter(ord => ord.Id == AssignOrderRequestsPage.AssignOrderList.Id);
    //   console.log("before ele : ", ele);
    //   ele.forEach(element => {
    //     console.log("element : ",element);
    //     element.AssignDate=AssignOrderRequestsPage.AssignOrderList.AssignDate;
    //     element.CalcMethod=AssignOrderRequestsPage.AssignOrderList.CalcMethod;
    //     element.Duration=AssignOrderRequestsPage.AssignOrderList.Duration;
    //     element.EmpId=AssignOrderRequestsPage.AssignOrderList.EmpId;
    //     element.ExpiryDate=AssignOrderRequestsPage.AssignOrderList.ExpiryDate;
    //     element.LeaveTypeId=AssignOrderRequestsPage.AssignOrderList.LeaveTypeId;
    //     element.TaskDesc=AssignOrderRequestsPage.AssignOrderList.TaskDesc;
    //   });
    //   console.log("after ele : ", ele);
    //   this.AssignOrderArr.push(ele);
    // }
  }

  public toggle(): void {
    this.toggled = this.toggled ? false : true;
  }

  ShowAssignOrder(item) {
    console.log("show");
    this.navCtrl.push(ShowAssignOrderRequestsPage, item);
  }

  filterItems() {
    this.AssignOrderArr = [];
    let val = this.queryText.toLowerCase();
    this.AssignOrderFilter = this.AssignOrderData.filter((v) => {
      if (v.Id) {
        if ((v.Id + '').indexOf(val) > -1) {
          return true;
        }
        return false;
      }
    });
    this.AssignOrderArr = this.AssignOrderFilter;
    this.AssignOrderCount = this.AssignOrderArr.length;
    this.AssignOrderFilter = [];
  }

  addAssignOrder() {
    this.navCtrl.push(AddAssignOrderPage);
  }

  EditAssignOrder(item) {
    this.navCtrl.push(EditAssignOrderPage, item)
  }

  SortedByYear() {
    this.SortedName = 'AssignDate';
  }
  SortedByName() {
    this.SortedName = 'Employee';
  }

  ConfirmDelete(item) {
    let a: any = {};

    this.translationService.get('ConfirmRemove').subscribe(t => {
      a.title = t;
    });

    this.translationService.get('RemoveReqMsg').subscribe(t => {
      a.message = t;
    });
    this.translationService.get('ALERT_YES').subscribe(t => {
      a.yes = t;
    });
    this.translationService.get('ALERT_NO').subscribe((data) => {
      a.no = data;
    })
    const alert = this.alertCtrl.create({
      title: a.title,
      message: a.message,
      buttons: [
        {
          text: a.no,
          role: 'cancel',
        },
        {
          text: a.yes,
          handler: () => {
            this.DeleteAssignOrder(item)
          }
        }
      ]
    });
    alert.present();
  }

  DeleteAssignOrder(item) {
    var removeLoader = this.loadingCtrl.create({
      content: 'deleting...'
    });
    let toast = this.toastCtrl.create({
      message: "Assign Order Is Deleted Successfully...",
      duration: 3000,
      position: 'bottom'
    });
    this.DeleteRequestObj.Id = item.Id;
    this.DeleteRequestObj.Language = this.user.Culture;
    removeLoader.present().then(() => {
      this.AssignOrderService.removeAssignOrder(this.DeleteRequestObj).subscribe((data) => {
        removeLoader.dismiss().then(() => {
          toast.present();
          var assArr: Array<any> = [];
          assArr = _.filter(this.AssignOrderArr, function (o) {
            return o.Id != item.Id;
          });
          console.log("assArr : ", assArr);
          this.AssignOrderCount--;
          this.AssignOrderArr = assArr;
        })

      }, (e) => {
        removeLoader.dismiss().then(() => {
          let toast = this.toastCtrl.create({
            message: "Error in deleting assign order, Please try again later.",
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        })
      })
    })
  }
}
