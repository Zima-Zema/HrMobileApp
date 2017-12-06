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
  public Today = new Date();

  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 0,
    Culture: "",
    CompanyId: 0
  }
  public user: IUser;
  public DeleteRequestObj: IDeleteRequest =
    {
      Id: 0,
      Language: ""
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
    let a: any = {};
    this.translationService.get('LoadingOrders').subscribe((data) => {
      a.message = data;
    })
    this.translationService.get('ErrorLoadingOrders').subscribe((data) => {
      a.Error = data;
    })

    this.EmpAssignOrderObj.EmpId = this.user.EmpId;
    this.EmpAssignOrderObj.Culture = this.user.Culture;
    this.EmpAssignOrderObj.CompanyId = this.user.CompanyId;
    var OrdersLoader = this.loadingCtrl.create({
      content: a.message
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
          message:  a.Error,
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
    this.AssignOrderArr = AssignOrderRequestsPage.AssignOrderList;
  }

  public toggle(): void {
    this.toggled = this.toggled ? false : true;
  }

  ShowAssignOrder(item) {
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
    let a: any = {};
    this.translationService.get('AssignOrderToastMsg').subscribe((data) => {
      a.title = data;
    })
    this.translationService.get('AssignOrderdeleting').subscribe((data) => {
      a.message = data;
    })
    this.translationService.get('AssignOrderErrorDeleting').subscribe((data) => {
      a.Error = data;
    })
    var removeLoader = this.loadingCtrl.create({
      content: a.message
    });
    let toast = this.toastCtrl.create({
      message: a.title,
      duration: 3000,
      position: 'bottom'
    });
    this.DeleteRequestObj.Id =  item.Id;
    this.DeleteRequestObj.Language = this.user.Culture;
    removeLoader.present().then(() => {
      this.AssignOrderService.removeAssignOrder(this.DeleteRequestObj).subscribe((data) => {
        removeLoader.dismiss().then(() => {
          toast.present();
          var assArr: Array<any> = [];
          assArr = _.filter(this.AssignOrderArr, function (o) {
            return o.Id != item.Id;
          });
          this.AssignOrderCount--;
          this.AssignOrderArr = assArr;
        })

      }, (e) => {
        removeLoader.dismiss().then(() => {
          let toast = this.toastCtrl.create({
            message: a.Error,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        })
      })
    })
  }
}
