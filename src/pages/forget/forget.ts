import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from "@angular/forms";
import { LoginServiceApi, ILogin, IForgotPassword } from "../../shared/loginService";
import { IUser } from "../../shared/IUser";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from '@ionic/storage';
import { ForceChangePasswordPage } from '../force-change-password/force-change-password';
/**
 * Generated class for the ForgetPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {
  public userName: string;
  public email: string;
  public user: IUser;
  public forgetForm: FormGroup;
  public generalError: string;
  public userNameRequired: boolean;
  public emailRequired: boolean;
  public companyNameExisted: boolean = false;
  public companyNameRequired: boolean;
  forgotModel: IForgotPassword = {
    Username: "",
    Email: ""
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logInService: LoginServiceApi,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private translationService: TranslateService
  ) {
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;

      }
    });

    this.createForm();
    this.storage.get("CompanyName").then((cdata) => {
      if (cdata) {
        this.forgetForm.controls['companyName'].setValue(cdata);
        this.companyNameExisted = true;
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }
  createForm() {
    this.forgetForm = this.formBuilder.group({
      companyName: [null, Validators.compose([Validators.required])],
      userName: [null, Validators.compose([Validators.required])],
      email: new FormControl('', [Validators.required, this.isValid()])

    });
  }

  InputBlured(inputName) {
    console.log("InputBlured", inputName);
    switch (inputName) {
      case "companyName":
        this.companyNameRequired = this.forgetForm.get('companyName').valid ? false : this.forgetForm.get('companyName').errors.required;
        break;
      case 'userName':
        this.userNameRequired = this.forgetForm.get('userName').valid ? false : this.forgetForm.get('userName').errors.required;
        //this.confirmPasswordMatched = this.logInForm.get('confirm').valid ? false : this.logInForm.get('confirm').hasError('equalTo');
        break;
      case 'email':
        this.emailRequired = this.forgetForm.get('email').valid ? false : this.forgetForm.get('email').errors.required;
        //this.confirmPasswordMatched = this.logInForm.get('confirm').valid ? false : this.logInForm.get('confirm').hasError('equalTo');
        break;
    }
  }
  InputFocused(inputName) {
    console.log("InputFocused", inputName);
    switch (inputName) {
      case 'companyName':
        this.companyNameRequired = false;
        if (this.generalError == "Invalid Company Name") {
          this.generalError = null;
        }
        break;
      case 'userName':
        this.userNameRequired = false;
        this.generalError = null;
        break;
      case 'email':
        this.emailRequired = false;
        this.generalError = null;
        break;
    }
  }
  isValid(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
      let input = control.value;

      let isValid = regExp.test(input)
      if (!isValid)
        return { 'isValid': { isValid } }
      else
        return null;
    };
  }
  onSubmit() {
    this.generalError = null;
    let loader = this.loadingCtrl.create({
      //content: "Loading .."
      spinner: 'dots'
    });
    loader.present();

    let userName: string = this.forgetForm.value.userName;
    let email: string = this.forgetForm.value.email;
    let Url = this.forgetForm.value.companyName;
    this.storage.set("BaseURL", Url).then(() => {
      this.storage.set("CompanyName", Url).then(() => {
        this.forgotModel.Username = userName;
        this.forgotModel.Email = email;
        this.logInService.forgotPassword(this.forgotModel).subscribe((data) => {
          if (data) {
            loader.dismiss();
            this.navCtrl.push(ForceChangePasswordPage, { UserName: data.UserName, OldPassword: this.user.Password, Code: data.Code });
          }
        }, (err) => {
          loader.dismiss();
          switch (err.status) {
            case 400:
              this.translationService.get('login400Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            case 404:
              this.translationService.get('login404Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            case 403:
              this.translationService.get('forgot403Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            default:
              break;
          }
        });
      });
    });
  }

}
