import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';

/**
 * Generated class for the DocumentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
})
export class DocumentsPage {
  loadingStatus;
  loadingProgress=0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private file: File,
    public alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions 
  ) {

    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentsPage');
  }

  bloodyDownload() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.loadingStatus = "PUsh"
    const url = 'https://static.pexels.com/photos/34950/pexels-photo.jpg';
    var pathFile = this.file.externalRootDirectory + 'Download/';

    fileTransfer.download(url, pathFile + 'pexels-photo.jpg').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.loadingStatus = entry.toURL();
    }, (error) => {
      this.loadingStatus = error.code;
    }).catch((rej) => {
      this.loadingStatus = rej;
    })
    fileTransfer.onProgress((progressEvent) => {
      if (progressEvent.lengthComputable) {
        this.loadingProgress =  Math.round((progressEvent.loaded / progressEvent.total) * 100);          
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



}
