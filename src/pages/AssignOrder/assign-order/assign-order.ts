import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddAssignOrderPage} from '../add-assign-order/add-assign-order';
import { AssignOrderServicesApi,IEmpAssignOrders} from '../../../shared/AssignOrderService';
@IonicPage()
@Component({
  selector: 'page-assign-order',
  templateUrl: 'assign-order.html',
})
export class AssignOrderPage {

public EmpAssignOrderObj:IEmpAssignOrders={
  EmpId:1099,
  Culture:"ar-EG",
  CompanyId:0
}

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
  public AssignOrderService:AssignOrderServicesApi) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssignOrderPage');
    this.AssignOrderService.GetEmpAssignOrders(this.EmpAssignOrderObj).subscribe((data)=>{
      console.log("tata : ",data)
    })
  }

  addAssignOrder(){
    this.navCtrl.push(AddAssignOrderPage)
  }

}
