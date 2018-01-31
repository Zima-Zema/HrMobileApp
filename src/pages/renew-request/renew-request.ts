import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';

import { IUser } from '../../shared/IUser';
import { Storage } from '@ionic/storage';
import { parse } from 'querystring';
import { TranslateService } from "@ngx-translate/core";
import { Camera } from '@ionic-native/camera';
import { unescape } from 'lodash';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
/**
 * Generated class for the RenewRequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-renew-request',
  templateUrl: 'renew-request.html',
})
export class RenewRequestPage {
  loadingStatus;
  public BASE64_MARKER = ';base64,';
  loadingProgress = 0;
  user: IUser;
  public baseURL;
  public isdisabled: boolean = true;
  private captureDataUrl: string = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public cam: Camera,
    private storage: Storage,
    private translationService: TranslateService

  ) {

    this.storage.get("BaseURL").then((val) => {
      this.baseURL = val;
    });
    this.storage.get("User").then((udata) => {
      if (udata) {
        this.user = udata;

      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RenewRequestPage');
  }


  ///
  //action sheet for images
  public presentActionSheet() {

    let a: any = {};
    this.translationService.get('AlbumTitle').subscribe((data) => {
      a.title = data;
    })
    this.translationService.get('CameraText').subscribe((data) => {
      a.camera = data;
    })
    this.translationService.get('GalleryText').subscribe((data) => {
      a.gallery = data;
    })

    let actionSheet = this.actionSheetCtrl.create({
      title: a.title,
      buttons: [
        {
          text: a.camera,
          handler: () => {
            this.openImage(this.cam.PictureSourceType.CAMERA);
          }
        },
        {
          text: a.gallery,
          handler: () => {
            this.openImage(this.cam.PictureSourceType.SAVEDPHOTOALBUM);
          }
        }
      ]
    });
    actionSheet.present();
  }

  openImage(SourceType) {

    let a: any = {};
    this.translationService.get('ErrorGetImage').subscribe((data) => {
      a.Errorget = data;
    })

    let Options = {
      sourceType: SourceType,
      destinationType: this.cam.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.cam.EncodingType.PNG,
      correctOrientation: true,
    };
    this.cam.getPicture(Options).then((imageData) => {
      if (imageData) {
        this.isdisabled = false;
        // this.ext = ".jpg";
        // let textfile = this.createFileName(this.ext);
        this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

        var blob = this.imageDataURItoBlob(this.captureDataUrl);
        var objURL = window.URL.createObjectURL(blob);

        window.URL.revokeObjectURL(objURL);

        var formData = new FormData();
        formData.append('file', blob, 'blob.jpg');




        var oXHR = new XMLHttpRequest();
        oXHR.open('POST', 'http://10.10.10.4:36207/FileUpload/UploadOneFile?Source=RenewRequest&SourceId=15');
        oXHR.send(formData);
        // this.TollenObj.FileDetails.push(textfile);
        // this.TollenObj.Files.push(imageData);
        // this.imags.push(this.captureDataUrl);
      }
    }).catch(
      (e: Error) => {
        let err_toast = this.toastCtrl.create({
          message: a.Errorget,
          duration: 3000,
          position: 'middle',
          cssClass: "tryerror.scss"
        });
        err_toast.present();
      }
      )
  }

  imageDataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;

    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
      type: mimeString
    });
  }
  fileDataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

  }
  public openFile() {

    let a: any = {};
    this.translationService.get('FileTitle').subscribe((data) => {
      a.title = data;
    })
    this.translationService.get('UploadText').subscribe((data) => {
      a.text = data;
    })

    let actionSheet = this.actionSheetCtrl.create({
      title: a.title,
      buttons: [
        {
          text: a.text,
          handler: () => { this.uploadfile(); }
        }
      ]
    });
    actionSheet.present();
  }
  uploadfile() {

    let a: any = {};
    this.translationService.get('SavedFile').subscribe((data) => {
      a.SaveFile = data;
    })
    this.translationService.get('findFilePath').subscribe((data) => {
      a.FilePath = data;
    })
    this.translationService.get('openFile').subscribe((data) => {
      a.openFile = data;
    })

    this.fileChooser.open().then((uri) => {

      var blob = this.fileDataURItoBlob(uri);
      var formData = new FormData();
      formData.append('file', blob);
      var oXHR = new XMLHttpRequest();
      oXHR.open('POST', 'http://10.10.10.4:36207/FileUpload/UploadOneFile?Source=RenewRequest&SourceId=19');
      oXHR.send(formData);



      this.filePath.resolveNativePath(uri).then(filePath => {
        let textfile = filePath.substr(filePath.lastIndexOf('/') + 1);
        let edit_path = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('?'));
        this.file.readAsDataURL(edit_path, textfile).then((b_data) => {
          this.isdisabled = false;
          let BinaryData = this.convertDataURIToBinary(b_data)
          let arr = Array.from(BinaryData);



          let success_toast = this.toastCtrl.create({
            message: a.SaveFile,
            duration: 3000,
            position: 'bottom'
          });
          success_toast.present();
        }).catch((e: Error) => {
          let err_toast = this.toastCtrl.create({
            message: a.FilePath,
            duration: 3000,
            position: 'middle'
          });
          err_toast.present();
        })
      }).catch((e: Error) => {
        let err_toast = this.toastCtrl.create({
          message: a.FilePath,
          duration: 3000,
          position: 'middle'
        });
        err_toast.present();
      })
    }).catch((e: Error) => {
      let err_toast = this.toastCtrl.create({
        message: a.openFile,
        duration: 3000,
        position: 'middle',
        cssClass: "tryerror.scss"
      });
      err_toast.present();
    });

  }

  convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

}
