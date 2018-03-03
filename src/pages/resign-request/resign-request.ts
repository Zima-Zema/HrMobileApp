import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms'
import { Storage } from '@ionic/storage';
import { IUser } from '../../shared/IUser';
import * as moment from 'moment';
import { ITerminationListVM, TerminationServicesApi, IPostTernimationVM } from '../../shared/TerminationServices';
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-resign-request',
  templateUrl: 'resign-request.html',
})
export class ResignRequestPage {
  //Form
  public resignOrderForm: FormGroup;
  public Employee: any;
  public Job: any;
  public Management: any;
  public LastDay: any;
  public ResignDate: any;
  //Data
  public localDateval: any;
  public minDate: any;
  public maxDate: any;
  public Id: number;
  public IsChanged = false;
  public msg:any={};
  //Toast
  public toast = this.toastCtrl.create({
    message: "",
    duration: 3000,
    position: 'middle'
  });
  // Objects
  public user: IUser;
  public TerminationListObj: ITerminationListVM = {
    Culture: "",
    EmpId: 0,
    CompanyId: 0,
  }
  public PostTernimation: IPostTernimationVM = {
    Culture: "",
    Id: 0,
    CompanyId: 0,
    PlanedDate: ""
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public TerminationService: TerminationServicesApi,
    private storage: Storage,
    public changeDetectref: ChangeDetectorRef,
    private translationService: TranslateService) {

    this.localDateval = new Date();
    this.minDate = new Date();
    let max = moment(this.minDate).add(1, 'years').calendar();
    this.maxDate = new Date(max);

    this.resignOrderForm = this.formBuilder.group({
      Employee: [''],
      Job: [''],
      Management: [''],
      LastDay: [''],
      ResignDate: ['']
    })

    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.TerminationListObj.EmpId = this.user.EmpId;
        this.TerminationListObj.Culture = this.user.Culture;
        this.TerminationListObj.CompanyId = this.user.CompanyId;
      }
    });
  }

  ionViewDidLoad() {
    this.translationService.get('ErrorToasterMsg').subscribe((data) => {
      this.msg.message = data;
    })
    var ResignLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    ResignLoader.present().then(() => {
      this.TerminationService.GetTermination(this.TerminationListObj).subscribe((data) => {
        ResignLoader.dismiss().then(() => {
          this.Employee = data.Employee;
          this.Job = data.Job;
          this.Management = data.Department;
          this.LastDay = data.PlanedDate;
          this.ResignDate = data.RequestDate;
          this.Id = data.Id;
          this.changeDetectref.detectChanges();
        })
      }, (e) => {
        ResignLoader.dismiss().then(() => {
          this.toast.setMessage(this.msg.message);
          this.toast.present();
        })
      })
    })
  }

  resignOrder() {
    this.translationService.get('ErrorToasterMsg').subscribe((data) => {
      this.msg.message = data;
    })
    this.translationService.get('correctToasterMsg').subscribe((data) => {
      this.msg.correct = data;
    })
    var ResignLoader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    let SuccessToast = this.toastCtrl.create({
      message: this.msg.correct,
      duration: 2000,
      position: 'bottom'
    });

    this.PostTernimation.Id = this.Id;
    this.PostTernimation.PlanedDate = this.LastDay;
    this.PostTernimation.Culture = this.user.Culture;
    this.PostTernimation.CompanyId = this.user.CompanyId;
    ResignLoader.present().then(() => {
      this.TerminationService.PostTerminationRequest(this.PostTernimation).subscribe((data) => {
        ResignLoader.dismiss().then(() => {
          SuccessToast.present();
          this.navCtrl.pop();
        })
      }, (e) => {
        ResignLoader.dismiss().then(() => {
          this.toast.setMessage(this.msg.message);
          this.toast.present();
        })
      })
    })
  }

  LastDayChange(LastDay) {
    this.LastDay = this.bloodyIsoString(LastDay);
      this.IsChanged = true;
  }

  LastDayCancel(planedDay) {
    this.IsChanged = false;
  }

  bloodyIsoString(bloodyDate: Date) {
    let tzo = -bloodyDate.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num) {
        let norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return bloodyDate.getFullYear() +
      '-' + pad(bloodyDate.getMonth() + 1) +
      '-' + pad(bloodyDate.getDate()) +
      'T' + pad(bloodyDate.getHours()) +
      ':' + pad(bloodyDate.getMinutes()) +
      ':' + pad(bloodyDate.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }
}
