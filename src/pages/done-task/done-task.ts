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
  lastImage: string = null;
  private captureDataUrl: string = "";
  public disc: string = "";
  public coming_Task: any = "";
  public desc: string = "";
  public Id: any = 0;
  public File_Label: string = "";
  public isdisabled: boolean = true;
  public ext: string = "";
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
  }
  //
  TollenObj: ITollen = {
    CompanyId: 0,
    Files: [],
    Language: "en-GB",
    Source: "EmpTasksForm",
    TaskId: this.coming_Task.id,
    FileDetails: []
  }
  //
  ionViewDidLoad() { }
  //action sheet for images
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Album',
      buttons: [
        {
          text: 'Take a new photo',
          handler: () => {
            this.openImage(this.cam.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Open your gallery',
          handler: () => {
            this.openImage(this.cam.PictureSourceType.PHOTOLIBRARY);
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
  //action sheet for files
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
  //open camera and gallery 
  //pass source type according to choose(camera or gallery)
  openImage(SourceType) {
    let Options = {
      sourceType: SourceType,
      destinationType: this.cam.DestinationType.FILE_URI,
      correctOrientation: true,
      quality: 100,
      saveToPhotoAlbum: false,
    };
    this.cam.getPicture(Options).then((imagePath) => {
      if (imagePath) {
        //make SaveData button enable
        this.isdisabled = false;
      }
      //resolve the image path 
      this.filePath.resolveNativePath(imagePath).then(filePath => {
        this.ext = ".jpg"; //type of extension in image
        //if gallery button click
        if (SourceType === this.cam.PictureSourceType.PHOTOLIBRARY) {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1); //path without name
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?')); //file name
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.ext));
        }
        else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.ext));
        }
      }, (err: Error) => {
        this.errortext = "path : " + err.message; 
      });
    }, (err: Error) => {
      this.errortext = "get pic : " + err.message;
    })
  }
  //Copy the image to a local folder
  public copyFileToLocalDir(namePath, currentName, newFileName: string) {
    this.filename = currentName;
    this.correctPath = namePath;
    //copy the new file 
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.filename = newFileName;
      this.correctPath = this.file.dataDirectory;
      //the image appear in page
      this.captureDataUrl = this.correctPath + newFileName;
      this.TollenObj.FileDetails.push(newFileName);
      this.TollenObj.Files.push(this.captureDataUrl);
    }, (err: Error) => {
      this.errortext = "copy : " + err.message;
    });
  }
  // Create a new name for the image or file according to time 
  public createFileName(ext: string): string {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ext;
    return newFileName;
  }
  //upload the text written in textarea
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
      this.ext = ".txt";
      let textfile = this.createFileName(this.ext);
      //write text on file
      this.file.writeFile(this.file.dataDirectory, textfile, this.disc, { replace: true })
        .then((data) => {
          let uri = this.file.dataDirectory + textfile;
          this.filename = textfile;
          this.correctPath = uri;
          this.TollenObj.FileDetails.push(textfile);
          this.TollenObj.Files.push(uri);
        })
        .catch((e: Error) => {
          this.errortext = e.message;
        });
      this.isdisabled = false;
    }
  }
  //
  uploadfile() {
    this.fileChooser.open().then((uri) => {
      this.filePath.resolveNativePath(uri)
        .then(filePath => {
          this.filename = filePath.substr(filePath.lastIndexOf('/') + 1);
          this.correctPath = filePath;
          this.TollenObj.FileDetails.push(this.filename);
          this.TollenObj.Files.push(uri);
        })
      this.isdisabled = false;
    })
      .catch((e: Error) => { this.errortext = e.message; });
    /////////////////////////////////////////////////////
    // let options1: FileUploadOptions = {
    //   fileKey: 'file',
    //   fileName: 'name.pdf',
    //   params: { resume: uri },
    //   chunkedMode: false,
    //   headers: { Authorization: localStorage.getItem('token') }
    // }
    ////////////////////////////////////////
    // this.fileOpener.open(this.file.dataDirectory + 'dbclick.txt', 'application/pdf')
    //   .then((data) => { this.filetext = data })
    //   .catch((e) => { this.filetext = e });
    /////////////////////////////////////////////////////
    // fileTransfer.upload(uri, "", options1)
    //   .then(
    //   (data) => { 
    //     this.errortext = JSON.stringify(data)
    //   },
    //   (err) => { 
    //     this.errortext = "error choose"
    //   }
    //   )
  }
  public arr1: Array<any> = [];
  public arr2: Array<any> = [];
  //
  SaveData() {
    this.filename = this.errortext = this.correctPath = "";
    this.TollenObj.TaskId = this.coming_Task.id;
    //test
    this.TollenObj.Files.forEach(element => {
      this.arr1 += element;
    });
    this.TollenObj.FileDetails.forEach(element => {
      this.arr2 += element;
    });
    //
    this.tasksService.saveData(this.TollenObj).subscribe((data) => {
      //if (data) {
      this.filename = data;
      this.viewCtrl.dismiss(this.TollenObj);
      // }
      // else {
      //   let toast = this.toastCtrl.create({
      //     message: "Fail to Add Documentations.",
      //     duration: 3000,
      //     position: 'middle'
      //   });
      //   toast.present();
      // }
    }, (err) => {
      this.errortext = err.message;
    });
  }
  //
  StepBack() {
    this.viewCtrl.dismiss();
  }
  // openCamera() {
  //   const cameraOptions: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.cam.DestinationType.DATA_URL,
  //     encodingType: this.cam.EncodingType.JPEG,
  //     mediaType: this.cam.MediaType.PICTURE,
  //   };

  //   this.cam.getPicture(cameraOptions).then((imageData) => {
  //     if (imageData) {
  //       this.isdisabled = false;
  //     }
  //     this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
  //     //this.correctPath=imageData
  //     //this.filename=this.captureDataUrl;
  //     this.filePath.resolveNativePath(imageData).then(filepath => {
  //       //   let path_without_filename = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
  //       this.filename = filepath.substring(filepath.lastIndexOf('/') + 1);  // just file name
  //       //   this.TollenObj.FileDetails = this.filename;
  //     }, (err: Error) => {
  //       this.errortext = err.message;
  //     })
  //     // this.TollenObj.Files.push(imageData);
  //   }, (err: Error) => {
  //     this.errortext = err.message;
  //   });
  // }
}
