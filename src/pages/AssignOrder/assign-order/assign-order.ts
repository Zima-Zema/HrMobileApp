import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ShowAssignOrderPage } from '../show-assign-order/show-assign-order';
import { AssignOrderServicesApi, IEmpAssignOrders } from '../../../shared/AssignOrderService';
import * as _ from 'lodash';

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
  public AssignOrderCount: number = 0;
  public static motherArr = [];
  public queryText: string;

  public EmpAssignOrderObj: IEmpAssignOrders = {
    EmpId: 1072,
    Culture: "ar-EG",
    CompanyId: 0
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public AssignOrderService: AssignOrderServicesApi) {
  }

  ionViewDidLoad() {
    // AssignOrderPage.motherArr = [];
    this.AssignOrderService.GetEmpAssignOrders(this.EmpAssignOrderObj).subscribe((data) => {
      console.log("tata : ", data);
      this.AssignOrderCount = data.length
      // this.AssignOrderList = data;
      // this.AssignOrderList = _.chain(data).groupBy('Manager').toPairs()
      //   .map(item => _.zipObject(['divisionType', 'divisionTypes'], item)).value();
      // this.AssignOrderArr = this.AssignOrderList;
     this.AssignOrderData=data;
      this.AssignOrderArr = data;
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
    this.navCtrl.push(ShowAssignOrderPage, item)
  }

  filterItems() {
    this.AssignOrderArr=[];
    let val = this.queryText.toLowerCase();
    this.AssignOrderFilter = this.AssignOrderData.filter((v) => {
      if (v.Id) { 
        if ((v.Id + '').indexOf(val) > -1) {
          return true;
        }
        return false;
      }     
    }); 
    this.AssignOrderArr=this.AssignOrderFilter;
    this.AssignOrderCount=this.AssignOrderArr.length;
    this.AssignOrderFilter=[];
  }
}
