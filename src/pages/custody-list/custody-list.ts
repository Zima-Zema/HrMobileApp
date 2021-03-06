import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { UtilitiesProvider, IGetEmpCustody } from '../../shared/utilities';
import { Storage } from '@ionic/storage';
import { IUser } from "../../shared/IUser";
import * as _ from 'lodash';
import { TranslateService } from "@ngx-translate/core";

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
  public custodyCount: number = 0;
  EmpCustody: IGetEmpCustody = {
    Language: "",
    CompanyId: 0,
    EmpId: 0
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private custodyApi: UtilitiesProvider,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private translationService: TranslateService) {
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

    let a: any = {};
    this.translationService.get('LoadingCustodies').subscribe((data) => {
      a.message = data;
    })

    var DocsLoader = this.loadingCtrl.create({
      content: a.message
    });
    DocsLoader.present().then(() => {
      this.custodyApi.getCustodies(this.EmpCustody).subscribe((data) => {
        this.custodyCount = data.length;
        this.custodyData = _.chain(data).groupBy('Disposal').toPairs()
          .map(item => _.zipObject(['divisionType', 'divisionTypes'], item)).value();
        DocsLoader.dismiss();

      }, (error) => {
        DocsLoader.dismiss();
        if (error.status === 0) {
          this.is0Error = true;
        }
        if (error.status === 404) {
          this.is404Error = true;
        }
        else if (error.status === 500) {
          this.is500Error = true;
        }

      });
    })


  }

}
