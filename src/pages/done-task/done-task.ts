import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, ToastController } from 'ionic-angular';
//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//pages
import { WelcomePage } from '../welcome/welcome';
import { TasksServicesApi, ITasks, ITollen } from '../../shared/TasksService';
//
@IonicPage()
@Component({
  selector: 'page-done-task',
  templateUrl: 'done-task.html',
})
export class DoneTaskPage {
  //
  private captureDataUrl: string = "";
  public disc: string = "";
  public coming_Task: any = "";
  public desc: string = "";
  public Id: any = 0;
  public File_Label: string = "";
  public isdisabled: boolean = true;
  //////////////////////for test
  public errortext: string = "";
  public correctPath: string = "";
  public filename: string = "";
  //
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public cam: Camera,
    private fileOpener: FileOpener,
    private file: File,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private transfer: FileTransfer,
    private viewCtrl: ViewController,
    private tasksService: TasksServicesApi,
    public toastCtrl: ToastController, ) {
    this.coming_Task = this.navParams.get('Task');
    console.log("this.coming_Task >>> ", this.coming_Task);
  }
  //
  TollenObj: ITollen = {
    CompanyId: 0,
    Files: [],
    Language: "en-GB",
    Source: "EmpTasksForm",
    TaskId: this.coming_Task.id,
    FileDetails: ""
  }
  //
  ionViewDidLoad() { }
  //
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Album',
      buttons: [
        {
          text: 'Take a new photo',
          handler: () => {
            this.openCamera();
          }
        },
        {
          text: 'Open your gallery',
          handler: () => {
            this.openGallery();
          }
        }
        //, {
        //   text: 'Cancel',
        //   role: 'cancel'
        // }
      ]
    });
    actionSheet.present();
  }
  //
  public openFile() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose File',
      buttons: [
        {
          text: 'Upload text ',
          handler: () => { this.uploadtext() },
          cssClass: 'Uploadtext'
        },
        {
          text: 'Upload from your device',
          handler: () => { this.uploadfile(); }
        }
      ]
    });
    actionSheet.present();
  }
  //
  openCamera() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.cam.DestinationType.DATA_URL,
      encodingType: this.cam.EncodingType.JPEG,
      mediaType: this.cam.MediaType.PICTURE,
    };

    this.cam.getPicture(cameraOptions).then((imageData) => {
      if (imageData) {
        this.isdisabled = false;
      }
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      //
      this.filePath.resolveNativePath(imageData).then(filepath => {
        //let path_without_filename = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
        this.filename = filepath.substr(filepath.lastIndexOf('/') + 1);  // just file name
        //this.correctPath = path_without_filename;
        //
        this.TollenObj.FileDetails = this.filename;
      })
      this.TollenObj.Files.push(imageData);
    }, (err) => {
      this.errortext = "error choose"
    });
  }
  //
  openGallery() {
    let Options = {
      sourceType: this.cam.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.cam.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.cam.EncodingType.JPEG,
      correctOrientation: true
    };

    this.cam.getPicture(Options).then(file_uri => {
      this.captureDataUrl = 'data:image/jpeg;base64,' + file_uri;
      if (file_uri) {
        this.isdisabled = false;
      }
      //
      this.filePath.resolveNativePath(file_uri).then(filepath => {
        let path_without_filename = file_uri.substring(file_uri.lastIndexOf('/') + 1, file_uri.lastIndexOf('?')); //path without file name
        //this.filename = filepath.substr(filepath.lastIndexOf('/') + 1);  // just file name
        this.correctPath = path_without_filename;
        //
        this.TollenObj.FileDetails = this.filename;
      });
      this.TollenObj.Files.push(file_uri);
    }
      , (err) => {
        this.errortext = err
      });
  }
  //
  //
  uploadtext() {
    if (this.disc == "") {
      let toast = this.toastCtrl.create({
        message: "Text file is empty..",
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    }
    else {
      //write text on file
      this.file.writeFile(this.file.dataDirectory, 'dbclick.txt', this.disc, { replace: true })
        .then((data) => { console.log(data) })
        .catch(e => {
          this.errortext = e;
          console.log(e)
        });
      // this.fileOpener.open(this.file.dataDirectory + 'dbclick.txt', 'application/pdf')
      //   .then((data) => { this.filetext = data })
      //   .catch((e) => { this.filetext = e });
      let uri = this.file.dataDirectory + 'dbclick.txt';
      this.filename = uri.substring(uri.lastIndexOf('/') + 1);
      console.log("this.correctPath", this.filename)
      this.TollenObj.FileDetails = this.filename;
      this.TollenObj.Files.push(uri);
      this.isdisabled = false;
    }
  }
  //
  uploadfile() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.fileChooser.open()
      .then((uri) => {
        this.filePath.resolveNativePath(uri)
          .then(filePath => {
            this.filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            this.TollenObj.FileDetails = this.filename;
            this.TollenObj.Files.push(uri);
          })
        this.isdisabled = false;
      })
      //.catch(err => this.errortext = "error path");
      /////////////////////////////////////////////////////
      // let options1: FileUploadOptions = {
      //   fileKey: 'file',
      //   fileName: 'name.pdf',
      //   params: { resume: uri },
      //   chunkedMode: false,
      //   headers: { Authorization: localStorage.getItem('token') }
      // }

      /////////////////////////////////////////////////////
      // fileTransfer.upload(uri, "", options1)
      //   .then(
      //   (data) => { 
      //     //console.log("data ", JSON.stringify(data)); 
      //     this.errortext = JSON.stringify(data)
      //   },
      //   (err) => { 
      //     //console.log("data ", JSON.stringify(err)); 
      //     this.errortext = "error choose"
      //   }
      //   )

      /////////////////////////////////////////////////////
      // returns native filesystem path for Android content URIs but can't be resolved to file path for file opener plugin
      // this.filePath.resolveNativePath(uri)
      //   .then(filePath => {
      //     //open file in pdf 
      //     this.fileOpener.open(filePath, 'application/pdf').then((data) => { this.errortext = data }).catch((e) => { this.errortext = "error open" });
      //     //upload file supposed to be here
      //   })
      //   .catch(err => this.errortext = "error path");

      // })
      .catch((e) => { this.errortext = "error choose" });
  }
  //
  SaveData() {
    this.TollenObj.TaskId = this.coming_Task.id;
    console.log("this.TollenObj  >>>", this.TollenObj);
    this.tasksService.saveData(this.TollenObj).subscribe((data) => {
      if (data) {
        this.viewCtrl.dismiss(this.TollenObj);
      }
      else {
        let toast = this.toastCtrl.create({
          message: "Fail to Add Documentations.",
          duration: 3000,
          position: 'middle'
        });
        toast.present();
      }
    });
  }
  //
  StepBack() {
    this.viewCtrl.dismiss();
  }
}
