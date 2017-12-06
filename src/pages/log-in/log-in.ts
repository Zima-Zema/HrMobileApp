import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { ForceChangePasswordPage } from '../force-change-password/force-change-password';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { LoginServiceApi } from "../../shared/loginService";
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { IUser } from "../../shared/IUser";
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
    selector: 'page-log-in',
    templateUrl: 'log-in.html',
    
})
export class LogInPage {

    public User: IUser;
    public logInForm: FormGroup;
    public companyNameRequired: boolean;
    public userNameRequired: boolean;
    public passwordRequired: boolean;
    public data: any;
    public generalError: string;
    public companyNameExisted: boolean = false;
    public userNameExisted: boolean = false;
    public passwordExisted: boolean = false;
    public type = 'password';
    public showPass = false;
    static baseUrl: string;
    constructor(
        private logInService: LoginServiceApi,
        private navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private storage: Storage,
        private network: Network,
        private translate: TranslateService,
        public platform: Platform) {

        this.createForm();
        this.getValues();
    }
    showPassword() {
        this.showPass = !this.showPass;

        if (this.showPass) {
            this.type = 'text';
        } else {
            this.type = 'password';
        }
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
                    this.User = udata;
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
            companyName: [null, Validators.compose([Validators.required, LogInPage.isValidUrl])],
            userName: [null, Validators.compose([Validators.required])],
            password: [null, Validators.compose([Validators.required])],
            rememberMe: false
        });
    }

    onSubmit() {
        this.generalError = null;
        let loader = this.loadingCtrl.create({
            content: "Loading .."
        });
        loader.present();

        let companyName = this.logInForm.value.companyName.trim();
        let userName = this.logInForm.value.userName.trim();
        let password = this.logInForm.value.password;
        let rememberMe = this.logInForm.value.rememberMe;

        this.logInService.logIn(companyName, userName, password).then((data: any) => {
            if (this.network.type == "none") {
                loader.dismiss();
                let alert = this.alertCtrl.create({
                    title: "Error",
                    buttons: [{ text: "Ok", role: "cancel" }],
                    message: "Error in Internet Connection .. Please Try again later",
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
                    message: "Error in Internet Connection .. Please Try again later",
                });
                alert.present();
            }
            else {
                this.storage.set("User", data).then(() => {
                    this.User = data;
                    this.storage.set("Lang", this.User.Language.slice(0, -3)).then(() => {
                        this.translate.setDefaultLang(this.User.Language.slice(0, -3));
                        if (this.User.Language.slice(0, -3) === 'ar') {
                            this.platform.setDir("rtl", true);
                        }
                        else {
                            this.translate.setDefaultLang('en');
                            this.platform.setDir("ltr", true);
                        }
                    });
                    if (this.User.ResetPassword) {
                        loader.dismiss();
                        this.navCtrl.push(ForceChangePasswordPage, { UserName: userName, Password: password });
                    }
                    else {
                        if (rememberMe) {
                            this.storage.set("Password", this.logInForm.value.password).then(() => {
                                loader.dismiss();
                                this.navCtrl.setRoot(WelcomePage);
                            });
                        }
                        else {
                            loader.dismiss();
                            this.storage.get("Lang").then((lang) => {
                                if (lang) {
                                    this.translate.setDefaultLang(lang);
                                    if (lang === 'ar') {
                                        this.platform.setDir("rtl", true);
                                    }
                                    else {
                                        this.platform.setDir("ltr", true);
                                    }
                                    this.navCtrl.setRoot(WelcomePage);
                                }
                                else {
                                    this.translate.setDefaultLang('en');
                                    this.platform.setDir("ltr", true);
                                    this.navCtrl.setRoot(WelcomePage);
                                }
                                

                            })

                        }
                    }
                });
            }
        }).catch((Zeoo) => {
            //loader.dismiss();
        })
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

    static isValidUrl(control: FormControl) {
        let regExp = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g; ///[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        // if (!regExp.test(control.value)) {
        //     return { 'wrongurl': "Invalid Url ex: www.example.com" };
        // }
        return null;
    }

    tasks() {
        this.navCtrl.setRoot(WelcomePage);
        this.navCtrl.popToRoot();
    }
    Logout() {
        this.storage.clear();
        this.navCtrl.setRoot(LogInPage);
        this.navCtrl.popToRoot();
    }

}
