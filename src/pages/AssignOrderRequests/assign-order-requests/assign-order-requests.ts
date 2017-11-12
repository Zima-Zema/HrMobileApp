import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { ShowAssignOrderRequestsPage } from '../show-assign-order-requests/show-assign-order-requests';
import { AddAssignOrderPage } from '../add-assign-order/add-assign-order';
import { AssignOrderServicesApi, IEmpAssignOrders } from '../../../shared/AssignOrderService';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-assign-order-requests',
  templateUrl: 'assign-order-requests.html',
})
export class AssignOrderRequestsPage {

  public toggled: boolean = false;
  public AssignOrderList: Array<any> = [];
  public AssignOrderArr: Array<any> = [];
  public AssignOrderFilter: Array<any> = [];
  public AssignOrderData: Array<any> = [];
  public AssignOrderCount: number ;
  public static motherArr = [];
  public queryText: string;

  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 17,
    Culture: "ar-EG",
    CompanyId: 0
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public AssignOrderService: AssignOrderServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }


  ionViewDidLoad() {
    var OrdersLoader = this.loadingCtrl.create({
      content: "Loading Orders..."
    });
    OrdersLoader.present().then(() => {
      this.AssignOrderService.GetMangersAssignOrders(this.EmpAssignOrderObj).subscribe((data) => {
        if (data) {
          OrdersLoader.dismiss().then(() => {
            this.AssignOrderCount = data.length
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
    console.log("edit");
  }

  ConfirmDelete() {
    console.log("Confirm Delete");
  }

}
