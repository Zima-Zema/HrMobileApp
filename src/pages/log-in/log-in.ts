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
  public companyNameExisted: boolean = false;
  public userNameExisted: boolean = false;
  public passwordExisted: boolean = false;

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

  getValues() {
    this.storage.get("CompanyName").then((cdata) => {
      if (cdata) {
        this.logInForm.controls['companyName'].setValue(cdata);
        this.companyNameExisted = true;
      }
      this.storage.get("User").then((udata) => {
        if (udata) {
          this.userNameExisted = true;
          this.logInForm.controls['userName'].setValue(udata.UserName);
        }
        this.storage.get("Password").then((pdata) => {
          if (pdata) {
            this.passwordExisted = true;
            this.logInForm.controls['password'].setValue(pdata);
            this.onSubmit();
          }
        });
      });
    });
  }

  createForm() {
    this.logInForm = this.formBuilder.group({
      companyName: [null, Validators.compose([Validators.required])],
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      rememberMe: false
    });
  }

  onSubmit() {
    console.log(this.logInForm.value);
    this.generalError = null;
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
          if (rememberMe) {
            this.storage.set("Password", this.logInForm.value.password).then(() => {
              loader.dismiss();
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
}
