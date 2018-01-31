import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { UtilitiesProvider, IGetEmpDocs } from '../../shared/utilities';
import { IUser } from '../../shared/IUser';
import { Storage } from '@ionic/storage';

import { TranslateService } from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
})
export class DocumentsPage {
  loadingStatus;

  loadingProgress = 0;
  user: IUser;
  is404Error: boolean = false;
  is500Error: boolean = false;
  is0Error: boolean = false;
  public docsData: Array<any> = [];
  public docCount: number = 0;

  EmpDocs: IGetEmpDocs = {
    Source: "",
    SourceId: 0
  }
  public baseURL;
  public isdisabled: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private file: File,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,


    private androidPermissions: AndroidPermissions,
    private docsApi: UtilitiesProvider,
    private storage: Storage,
    private translationService: TranslateService) {
    this.storage.get("BaseURL").then((val) => {
      this.baseURL = val;
    });
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;
        this.EmpDocs.Source = "People";
        this.EmpDocs.SourceId = this.user.EmpId;
      }
    });
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
  }

  ionViewDidLoad() {
    let a: any = {};
    this.translationService.get('LoadingDocs').subscribe((data) => {
      a.message = data;
    })

    var DocsLoader = this.loadingCtrl.create({
      content: a.message
    });
    DocsLoader.present().then(() => {
      this.docsApi.getEmpDocs(this.EmpDocs).subscribe((data) => {
        this.docsData = data;
        this.docCount = data.length;
        DocsLoader.dismiss()
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

  bloodyDownload(url, name) {
    let fullUrl = `${this.baseURL}${encodeURIComponent(url)}`;
    const realUrl = fullUrl.replace(/\s+/g, '%20');
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.loadingStatus = "PUsh"
    //const url = 'https://static.pexels.com/photos/34950/pexels-photo.jpg';
    var pathFile = this.file.externalRootDirectory + 'Download/';

    fileTransfer.download(fullUrl, pathFile + new Date().getTime().toString() + "_" + name).then((entry) => {
      this.loadingStatus = entry.toURL();
      const alertSuccess = this.alertCtrl.create({
        title: `Download Succeeded!`,
        subTitle: `${name} was successfully downloaded to: ${entry.toURL()}`,
        buttons: ['Ok']
      });
      alertSuccess.present();
    }, (error) => {
      this.loadingStatus = error.code;
      const alertFailure = this.alertCtrl.create({
        title: `Download Failed!`,
        subTitle: `${name} was not successfully downloaded. Error code: ${error.code}`,
        buttons: ['Ok']
      });
      alertFailure.present();
    });
    fileTransfer.onProgress((progressEvent) => {
      if (progressEvent.lengthComputable) {
        this.loadingProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      }
    })
    // const fileTransfer: FileTransferObject = this.transfer.create();

    // const imageLocation = 'https://static.pexels.com/photos/34950/pexels-photo.jpg';

    // fileTransfer.download(imageLocation, pathFile + "pexels-photo.jpg").then((entry) => {

    //   const alertSuccess = this.alertCtrl.create({
    //     title: `Download Succeeded!`,
    //     subTitle: `pexels-photo.jpg was successfully downloaded to: ${entry.toURL()}`,
    //     buttons: ['Ok']
    //   });
    //   alertSuccess.present();

    // }, (error) => {
    //   const alertFailure = this.alertCtrl.create({
    //     title: `Download Failed!`,
    //     subTitle: `pexels-photo.jpg was not successfully downloaded. Error code: ${error.code}`,
    //     buttons: ['Ok']
    //   });
    //   alertFailure.present();
    // });
  }

  getRound(item) {
    return Math.round((item / 1024) * 100) / 100
  }



}
