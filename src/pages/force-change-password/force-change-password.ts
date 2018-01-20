import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from "@angular/forms";
import { LoginServiceApi, IResetPassword } from "../../shared/loginService";
import { IUser } from "../../shared/IUser";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-force-change-password',
  templateUrl: 'force-change-password.html',
})
export class ForceChangePasswordPage {
  public newPassword: string;
  public confirm: string;
  public confirmPasswordMatched: boolean
  public newPasswordRequired: boolean;
  public confirmPasswordRequired: boolean;
  public user: IUser;
  public logInForm: FormGroup;
  public generalError: string;
  currentUser: IResetPassword;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private logInService: LoginServiceApi,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private translationService: TranslateService) {
    this.currentUser = this.navParams.data;

    this.createForm();
  }

  ionViewDidLoad() {
  }
  createForm() {
    this.logInForm = this.formBuilder.group({
      newPassword: [null, Validators.compose([Validators.required,this.validate()])],
      confirm: new FormControl('', [Validators.required, this.equalto('newPassword')])

    });
  }
  GoToWelcome() {
    this.navCtrl.setRoot(WelcomePage);
    this.navCtrl.popToRoot();
  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;

      let isValid = control.root.value[field_name] == input
      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }

  validate():ValidatorFn {
    var minMaxLength = /^[\s\S]{8,32}$/,
    upper = /[A-Z]/,
    lower = /[a-z]/,
    number = /[0-9]/,
    special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
   

    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;
      if (minMaxLength.test(input) && upper.test(input) && lower.test(input) && number.test(input) && special.test(input)) {
      return null;
    }
    else{
      return { 'validTo': { isValid:false } }
    }

    }
   


  }

  InputBlured(inputName) {
    switch (inputName) {
      case 'newPassword':
        this.newPasswordRequired = this.logInForm.get('newPassword').valid ? false : this.logInForm.get('newPassword').errors.required;
        //this.confirmPasswordMatched = this.logInForm.get('confirm').valid ? false : this.logInForm.get('confirm').hasError('equalTo');
        break;
      case 'confirm':
        this.confirmPasswordRequired = this.logInForm.get('confirm').valid ? false : this.logInForm.get('confirm').errors.required;
        //this.confirmPasswordMatched = this.logInForm.get('confirm').valid ? false : this.logInForm.get('confirm').hasError('equalTo');
        break;
    }
  }
  InputFocused(inputName) {
    switch (inputName) {
      case 'newPassword':
        this.newPasswordRequired = false;
        this.generalError = null;
        break;
      case 'confirm':
        this.confirmPasswordRequired = false;
        this.generalError = null;
        break;
    }
  }
  onSubmit() {

    let a: any = {};
    this.translationService.get('ConfirmPassword').subscribe((data) => {
      a.message = data;
    })
    this.translationService.get('oldPasswordMatched').subscribe((data) => {
      a.oldPassMessage = data;
    })
    this.generalError = null;
    let loader = this.loadingCtrl.create({
      //content: "Loading .."
      spinner: 'dots'
    });
    loader.present();

    let newPassword: string = this.logInForm.value.newPassword;
    let confirmPassword: string = this.logInForm.value.confirm;
    if (newPassword === confirmPassword) {

      if (newPassword !== this.currentUser.OldPassword) {
        this.currentUser.Password = newPassword;
        this.currentUser.ConfirmPassword = confirmPassword;
        this.logInService.resetPassword(this.currentUser).subscribe((data) => {
          console.log("reset Data", data);
          this.storage.set("User", data).then(() => {
            this.navCtrl.popToRoot();
          });
        }, (error) => {
          console.log("resetError", error.status);
          switch (error.status) {
            case 409:
              this.translationService.get('rest409Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            case 304:
              this.translationService.get('reset304Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            case 400:
              this.translationService.get('login400Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            case 403:
              this.translationService.get('reset403Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            case 404:
              this.translationService.get('login404Error').subscribe((data) => {
                this.generalError = data;
              })
              break;
            default:
              break;
          }
        })
        loader.dismiss();
      }
      else {
        loader.dismiss();
        this.generalError = a.oldPassMessage;
      }


    }
    else {
      this.logInForm.reset();
      this.confirmPasswordMatched = true;
      loader.dismiss();
      this.generalError = a.message;
    }
  }

}
