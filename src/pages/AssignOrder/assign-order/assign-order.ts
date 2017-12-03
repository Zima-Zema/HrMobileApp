import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ShowAssignOrderPage } from '../show-assign-order/show-assign-order';
import { AssignOrderServicesApi, IEmpAssignOrders } from '../../../shared/AssignOrderService';
import * as _ from 'lodash';
import { IUser } from '../../../shared/IUser';
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-assign-order',
  templateUrl: 'assign-order.html',
})
export class AssignOrderPage {
  public toggled: boolean = false;
  public AssignOrderList: Array<any> = [];
  public AssignOrderArr: Array<any> = [];
  public AssignOrderFilter: Array<any> = [];
  public AssignOrderData: Array<any> = [];
  public AssignOrderCount: number;
  public static motherArr = [];
  public queryText: string;

  public user: IUser;
  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 0,
    Culture: "",
    CompanyId: 0
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public AssignOrderService: AssignOrderServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private translationService: TranslateService ) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
      }
    });
  }

  ionViewDidLoad() {
    let a: any = {};
    this.translationService.get('LoadingOrders').subscribe((data) => {
      a.message = data;
    })
    this.translationService.get('ErrorLoadingOrders').subscribe((data) => {
      a.Error = data;
    })
    
    this.EmpAssignOrderObj.EmpId = this.user.EmpId;
    this.EmpAssignOrderObj.CompanyId=this.user.CompanyId;
    this.EmpAssignOrderObj.Culture=this.user.Culture;

    var OrdersLoader = this.loadingCtrl.create({
      content: a.message
    });
    OrdersLoader.present().then(() => {
      this.AssignOrderService.GetEmpAssignOrders(this.EmpAssignOrderObj).subscribe((data) => {
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
          message: a.Error,
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
    this.navCtrl.push(ShowAssignOrderPage, item)
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
}
