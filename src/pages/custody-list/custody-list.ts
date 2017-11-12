import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilitiesProvider, IGetEmpCustody } from '../../shared/utilities';
import { Storage } from '@ionic/storage';
import { IUser } from "../../shared/IUser";
import * as _ from 'lodash';
/**
 * Generated class for the CustodyListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custody-list',
  templateUrl: 'custody-list.html',
})
export class CustodyListPage {
  user: IUser;
  is404Error: boolean = false;
  is500Error: boolean = false;
  is0Error: boolean = false;
  public custodyData: Array<any> = [];
  public custodyCount: number;
  EmpCustody: IGetEmpCustody = {
    Language: "",
    CompanyId: 0,
    EmpId: 0
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private custodyApi: UtilitiesProvider, private storage: Storage) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.EmpCustody.CompanyId = this.user.CompanyId;
        this.EmpCustody.EmpId = this.user.EmpId;
        this.EmpCustody.Language = this.user.Language;
      }
    });
  }

  ionViewDidLoad() {
    console.log("OBj", this.EmpCustody);
    this.custodyApi.getCustodies(this.EmpCustody).subscribe((data) => {
      console.log("bloody Custody>>", data);
      this.custodyCount = data.length;
      this.custodyData = _.chain(data).groupBy('Disposal').toPairs()
      .map(item => _.zipObject(['divisionType', 'divisionTypes'], item)).value();
   
    console.log("this.Leaves_Arr : ", this.custodyData);

    }, (error) => {
      console.log("the bloody error", error);
      if (error.status === 0) {
        this.is0Error = true;
      }
      if (error.status === 404) {
        this.is404Error = true;
      }
      else if (error.status === 500) {
        this.is500Error = true;
      }

    })
  }

}
