import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginServiceApi, ILanguage } from '../../shared/loginService';
import { IUser } from "../../shared/IUser";
/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  language: string;
  enableSave;
  user: IUser;
  langResetOBJ: ILanguage = {
    Language: "",
    Password: "",
    UserName: ""
  }
  public LangErrorToast;
  public LangSuccessToast;
  constructor(
    public navCtrl: NavController,
    public loginServiceApi: LoginServiceApi,
    public alertCtrl: AlertController,
    private translationService: TranslateService,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private ToastCtrl: ToastController, ) {

    //get msg here
    this.translationService.get('LangErrorToast').subscribe(t => {
      this.LangErrorToast = t;
    });
    this.translationService.get('LangSuccessToast').subscribe(t => {
      this.LangSuccessToast = t;
    });
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.langResetOBJ.Password = this.user.Password
        this.langResetOBJ.UserName = this.user.UserName;
      }
    });
    this.storage.get("Lang").then((data) => {
      if (data) {
        if (data === "en") {
          this.language = data + "-GB";
        }
        else if (data === "ar") {
          this.language = data + "-EG";
        }

      } else {
        let lan = this.translationService.getDefaultLang();
        if (lan === "en") {
          this.language = data + "-GB";
        }
        else if (lan === "ar") {
          this.language = data + "-EG";
        }
      }

    });
  }
  //Loader

  //Toaster


  public dummyToast = this.ToastCtrl.create({
    message: "this.LangSuccessToast",
    duration: 2000,
    position: 'bottom'
  })
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  languageChange(language) {
    console.log(`Selected language: ${language}`);
    console.log(`current language: ${this.translationService.getDefaultLang()}`);
    let lan = this.translationService.getDefaultLang();
    if (lan === "en") {
      lan = lan + "-GB";
    }
    else if (lan === "ar") {
      lan = lan + "-EG";
    }
    if (lan === language) {
      this.enableSave = false;
    }
    else {
      this.enableSave = true;
    }

    //this.langResetOBJ.Language = language;

  }
  Save() {

    //Call Api here
    let LoadingLang = this.loadingCtrl.create({
      spinner: 'dots'
    });
    console.log("errorTost", this.LangErrorToast);
    console.log("successTost", this.LangSuccessToast);
    this.langResetOBJ.Language = this.language;
    console.log(this.langResetOBJ);
    LoadingLang.present().then(() => {
      this.loginServiceApi.resetLanguage(this.langResetOBJ).subscribe((data) => {
        console.log(data)
        if (data == 1) {
          let SuccessMsgToast = this.ToastCtrl.create({
            message: this.LangSuccessToast,
            duration: 2000,
            position: 'bottom'
          })
          LoadingLang.dismiss().then(() => {
            SuccessMsgToast.present().then(() => {
              this.storage.set("Lang", this.language.slice(0, -3)).then(() => {
                this.enableSave = false;
                let a: any = {};

                this.translationService.get('ALERT_TITLE').subscribe(t => {
                  a.title = t;
                });

                this.translationService.get('ALERT_message').subscribe(t => {
                  a.message = t;
                });
                this.translationService.get('ALERT_YES').subscribe(t => {
                  a.ok = t;
                });
                this.translationService.get('ALERT_NO').subscribe((data) => {
                  a.cancel = data;
                })
                this.alertCtrl.create({
                  title: a.title,
                  message: a.message,
                  buttons: [{
                    text: a.ok,
                    handler: () => {
                      window.location.reload();
                    }
                  },
                  {
                    text: a.cancel,
                    role: 'cancel'
                  }
                  ]
                }).present();
              });
            })

          })

        }
        else {
          this.storage.get("Lang").then((data) => {
            if (data) {
              if (data === "en") {
                this.language = data + "-GB";
              }
              else if (data === "ar") {
                this.language = data + "-EG";
              }

            } else {
              let lan = this.translationService.getDefaultLang();
              if (lan === "en") {
                this.language = data + "-GB";
              }
              else if (lan === "ar") {
                this.language = data + "-EG";
              }
            }

          });
        }

      }, (error) => {
        console.log("the bloody error", error);
        this.enableSave = false;
        if (error) {
          let ErrorMsgToast = this.ToastCtrl.create({
            message: this.LangErrorToast,
            duration: 2000,
            position: 'middle'
          });
          LoadingLang.dismiss().then(() => {
            ErrorMsgToast.present().then(() => {
              this.storage.get("Lang").then((data) => {
                if (data) {
                  if (data === "en") {
                    this.language = data + "-GB";
                  }
                  else if (data === "ar") {
                    this.language = data + "-EG";
                  }
                } else {
                  let lan = this.translationService.getDefaultLang();
                  if (lan === "en") {
                    this.language = data + "-GB";
                  }
                  else if (lan === "ar") {
                    this.language = data + "-EG";
                  }
                }

              });
            });
          });
        }
      });
    });



  }



}
