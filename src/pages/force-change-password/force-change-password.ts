import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from "@angular/forms";
import { LoginServiceApi } from "../../shared/loginService";
import { Storage } from '@ionic/storage';
import { IUser } from "../../shared/IUser";
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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private logInService: LoginServiceApi,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private storage: Storage, ) {
      this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        
      }

    });

    this.createForm();
  }

  ionViewDidLoad() {
  }
  createForm() {
    this.logInForm = this.formBuilder.group({
      newPassword: [null, Validators.compose([Validators.required])],
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
    this.generalError = null;
    let loader = this.loadingCtrl.create({
      content: "Loading .."
    });
    loader.present();

    let newPassword:string = this.logInForm.value.newPassword;
    let confirmPassword:string = this.logInForm.value.confirm;
    console.log(newPassword);
    console.log(confirmPassword);
    if (newPassword===confirmPassword) {
      console.log("Burn Them All");
      loader.dismiss();
    }
    else{
      
      console.log("Wow")
      this.logInForm.reset();
      this.confirmPasswordMatched=true;
      loader.dismiss();
      this.generalError="Confirm Password is NOT Matched !!";
    }

  }

}
