import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { ForceChangePasswordPage } from '../force-change-password/force-change-password';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoginServiceApi } from "../../shared/loginService";
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  public User: any;
  public logInForm: FormGroup;
  public companyNameRequired: boolean;
  public userNameRequired: boolean;
  public passwordRequired: boolean;
  public data: any;
  public generalError: string;
  public companyName = null;
  public rememberMe = null;
  public password = null;

  constructor(
    private logInService: LoginServiceApi,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private network: Network) {

    this.createForm();

    this.getValues();
  }

  ionViewWillEnter() {


  }

  ionViewDidLoad() {

  }

  getValues() {

    this.storage.get("CompanyName").then((cdata) => {
      this.companyName = cdata;
      this.storage.get("User").then((udata) => {
        this.User = udata;
        this.storage.get("Password").then((pdata) => {
          this.password = pdata;
          //this.printNames(this.companyName, this.User, this.password);
          this.logInForm.controls['companyName'].setValue('ali');

        });
      });
    });

  }

  async printNames(c: any, u: any, p: any) {
    console.log(c);
    console.log(u);
    console.log(p);
  }

  createForm() {
    this.logInForm = this.formBuilder.group({
      companyName: [null, Validators.compose([Validators.required])],
      userName: [this.User == null ? '' : this.User.UserName, Validators.compose([Validators.required])],
      password: [this.password == null ? '' : this.password, Validators.compose([Validators.required])],
      rememberMe: false
    });
  }

  onSubmit() {
    let loader = this.loadingCtrl.create({
      content: "Loading .."
    });
    loader.present();
    let companyName = this.logInForm.value.companyName;
    let userName = this.logInForm.value.userName;
    let password = this.logInForm.value.password;
    let rememberMe = this.logInForm.value.rememberMe;

    this.logInService.logIn(companyName, userName, password).then((data: any) => {
      if (this.network.type == "none") {
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: "Error",
          buttons: [{ text: "Ok", role: "cancel" }],
          message: "Error in Internet Connection .. Please Try again latter",
        });
        alert.present();
      }
      if (typeof (data) == "string") {
        this.generalError = data;
        loader.dismiss();
      }
      else if (data.type == "error") {
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: "Error",
          buttons: [{ text: "Ok", role: "cancel" }],
          message: "Error in Internet Connection .. Please Try again latter",
        });
        alert.present();
      }
      else {
        this.storage.set("User", data).then(() => {
          this.User = data;
          if (this.rememberMe) {
            this.storage.set("Password", this.logInForm.value.password).then(() => {
              loader.dismiss();
              console.log(this.User);
            });
          }
          else {
            loader.dismiss();
          }
        });
      }
    });
  }

  GoToFirstLogin() {
    this.navCtrl.push(ForceChangePasswordPage);
  }

  InputBlured(inputName) {
    switch (inputName) {
      case "companyName":
        this.companyNameRequired = this.logInForm.get('companyName').valid ? false : this.logInForm.get('companyName').errors.required;
        break;
      case 'userName':
        this.userNameRequired = this.logInForm.get('userName').valid ? false : this.logInForm.get('userName').errors.required;
        break;
      case 'password':
        this.passwordRequired = this.logInForm.get('password').valid ? false : this.logInForm.get('password').errors.required;
        break;
    }
  }

  InputFocused(inputName) {
    switch (inputName) {
      case 'companyName':
        this.companyNameRequired = false;
        if (this.generalError == "Invalid Company Name") {
          this.generalError = null;
        }
        break;
      case 'userName':
        if (this.generalError == "Incorrect Username or Password !!") {
          this.generalError = null;
        }
        this.userNameRequired = false;
        break;
      case 'password':
        if (this.generalError == "Incorrect Username or Password !!") {
          this.generalError = null;
        }
        this.passwordRequired = false;
        break;
    }
  }

  prepareForm() {
    let promise = new Promise((resolve, reject) => {

      resolve();
    });
    return promise;
  }
}
