import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { LeaveServicesApi, ILeavesTrans } from '../../../shared/LeavesService'
import * as _ from 'lodash';
import { products } from "./refData";
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
@IonicPage()
@Component({
  selector: 'page-trans-leaves',
  templateUrl: 'trans-leaves.html',
})
export class TransLeavesPage {
  private gridData: any[] = products;

  public LeavesCount: Number;
  public CreditQtyCount;
  public LeavesTrans: ILeavesTrans = {
    CompanyId: 0,
    Culture: "ar-EG",
    EmpId: 1072,
    StartDate: new Date()
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private LeaveServices: LeaveServicesApi,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
    this.loadProducts();

  }
  private groups: GroupDescriptor[] = [{ field: "LeaveType", aggregates: [{ field: "CreditQty", aggregate: "sum" },{ field: "LeaveType", aggregate: "count" },{ field: "DebitQty", aggregate: "sum" }] }];

  private gridView: DataResult;

  private loadProducts(): void {
    var LeavesLoader = this.loadingCtrl.create({
      content: "Loading Leaves..."
    });
    LeavesLoader.present().then(() => {
      this.LeaveServices.getLeaveTrans(this.LeavesTrans).subscribe((data) => {
        console.log("LeavesTrans", data)
        if (data) {
          LeavesLoader.dismiss().then(() => {
            this.LeavesCount = data.length;
            this.gridView = process(data, { group: this.groups });
          })
        }
        else {
          LeavesLoader.dismiss();
        }
      }, (e) => {
        let toast = this.toastCtrl.create({
          message: "Error in getting Trans Leaves, Please Try again later.",
          duration: 3000,
          position: 'middle'
        });
        LeavesLoader.dismiss().then(() => {
          toast.present();
        });
      })
    })

    //this.gridView = process(products, { group: this.groups });
  }



  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    this.loadProducts();
  }
  ionViewDidLoad() {


    // var LeavesLoader = this.loadingCtrl.create({
    //   content: "Loading Leaves..."
    // });
    // LeavesLoader.present().then(() => {
    //   this.LeaveServices.getLeaveTrans(this.LeavesTrans).subscribe((data) => {
    //     if (data) {
    //       LeavesLoader.dismiss().then(() => {
    //         this.LeavesCount = data.length;
    //         this.CreditQtyCount = _.chain(data).groupBy('LeaveType').map((objs, key) => ({
    //           'LeaveType': key,
    //           'objs': objs,
    //           'total': (_.sumBy(objs, 'CreditQty')) - (_.sumBy(objs, 'DebitQty'))
    //         })).value();
    //       })
    //     }
    //     else {
    //       LeavesLoader.dismiss();
    //     }
    //   }, (e) => {
    //     let toast = this.toastCtrl.create({
    //       message: "Error in getting Trans Leaves, Please Try again later.",
    //       duration: 3000,
    //       position: 'middle'
    //     });
    //     LeavesLoader.dismiss().then(() => {
    //       toast.present();
    //     });
    //   })
    // })
  }

}
