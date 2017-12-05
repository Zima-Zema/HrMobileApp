import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
//plugins
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
//pages
import { WelcomePage } from '../../welcome/welcome';
import { TasksServicesApi, ITasks, ITollen } from '../../../shared/TasksService';
import { IUser } from "../../../shared/IUser";

//
@IonicPage()
@Component({
  selector: 'page-done-task',
  templateUrl: 'done-task.html',
})
export class DoneTaskPage {
  public BASE64_MARKER = ';base64,';
  private captureDataUrl: string = "";
  public disc: string = "";
  public coming_Task: any = "";
  public isdisabled: boolean = true;
  public ext: string = "";
  public imags: Array<any> = [];
  //
  TollenObj: ITollen = {
    CompanyId: 0,
    Files: [],
    Language: "",
    Source: "EmpTasksForm",
    TaskId: this.coming_Task.id,
    FileDetails: []
  }

  user: IUser;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public cam: Camera,
    private file: File,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private viewCtrl: ViewController,
    private tasksService: TasksServicesApi,
    public toastCtrl: ToastController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private translationService: TranslateService) {
      this.storage.get("User").then((udata) => {
        if (udata) {
          this.user = udata;
          this.TollenObj.CompanyId = this.user.CompanyId;
          this.TollenObj.Language = this.user.Language;
        }
      });
    this.coming_Task = this.navParams.get('Task');
  }

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
  //action sheet for files
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
  //
  valuechange(it) {
    this.uploadtext();
  }

  //upload the text written in textarea
  uploadtext() {

    let a: any = {};
    this.translationService.get('TextEmptyMsg').subscribe((data) => {
      a.title = data;
    })
    this.translationService.get('ErrorWriteFile').subscribe((data) => {
      a.ErrorWrite = data;
    })

    let str_file = this.disc.trim();
    if (str_file == '') {
      let err_toast = this.toastCtrl.create({
        message: a.title,
        duration: 2000,
        position: 'middle'
      });
      err_toast.present();
    }
    else {
      this.ext = ".txt";
      let textfile = this.createFileName(this.ext);
      let err_toast = this.toastCtrl.create({
        message: a.ErrorWrite,
        duration: 3000,
        position: 'middle'
      });
      //write text on file
      this.file.writeFile(this.file.dataDirectory, textfile, this.disc, { replace: true }).then((data) => {
        let uri = this.file.dataDirectory;
        this.file.readAsDataURL(uri, textfile).then((b_data) => {
          this.isdisabled = false;
          let BinaryData = this.convertDataURIToBinary(b_data);
          let arr = Array.from(BinaryData);           // convert it to array
          this.TollenObj.Files.push(arr);
          this.TollenObj.FileDetails.push(textfile);
        }, (e) => {
          err_toast.present();
        });
      }).catch((e: Error) => {
        err_toast.present();
      });
    }
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
        this.ext = ".jpg";
        let textfile = this.createFileName(this.ext);
        this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
        this.TollenObj.FileDetails.push(textfile);
        this.TollenObj.Files.push(imageData);
        this.imags.push(this.captureDataUrl);
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
  // Create a new name for the image or file according to time 
  public createFileName(ext: string): string {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ext;
    return newFileName;
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

  //
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
      this.filePath.resolveNativePath(uri).then(filePath => {
        let textfile = filePath.substr(filePath.lastIndexOf('/') + 1);
        let edit_path = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('?'));
        this.file.readAsDataURL(edit_path, textfile).then((b_data) => {
          this.isdisabled = false;
          let BinaryData = this.convertDataURIToBinary(b_data)
          let arr = Array.from(BinaryData);
          this.TollenObj.FileDetails.push(textfile);
          this.TollenObj.Files.push(arr);
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
  //
  SaveData() {
    let a: any = {};
    this.translationService.get('LoadDocument').subscribe((data) => {
      a.loadDocum = data;
    })
    this.translationService.get('ErroraddDocument').subscribe((data) => {
      a.ErrorAddDocum = data;
    })

    this.TollenObj.TaskId = this.coming_Task.id;
    let loader = this.loadingCtrl.create({
      content: a.loadDocum
    });
    loader.present().then(() => {
      this.tasksService.saveData(this.TollenObj).subscribe((data) => {
        if (data) {
          loader.dismiss();
          this.viewCtrl.dismiss(this.TollenObj).then(() => {
          })
        }
      }, (err) => {
        let err_toast = this.toastCtrl.create({
          message: a.ErrorAddDocum,
          duration: 3000,
          position: 'middle',
        });
        loader.dismiss().then(() => {
          err_toast.present();
          this.viewCtrl.dismiss()
        });
      });
    })
  }
  //
  StepBack() {
    this.viewCtrl.dismiss();
  }
}
