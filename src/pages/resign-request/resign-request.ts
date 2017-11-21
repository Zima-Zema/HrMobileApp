import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage';
import { IUser } from '../../shared/IUser';
import * as moment from 'moment';

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


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

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

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResignRequestPage');
  }

  resignOrder() {
    console.log("Resign b2a")
  }

  LastDayCancel(LastDay) {
    console.log("Cancel LastDay", LastDay);
  }

  LastDayChange(LastDay) {
    console.log("Change LastDay", LastDay);
    this.LastDay = this.bloodyIsoString(LastDay)
  }

  InputBlur(input) {
    switch (input) {
      case 'LastDay':
        console.log("switch case last day")
        break;
    }
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
