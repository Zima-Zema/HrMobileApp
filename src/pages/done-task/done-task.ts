import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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

  private captureDataUrl: string = "";
  public disc: string = "";
  public coming_Task: any = "";
  public isdisabled: boolean = true;
  public ext: string = "";
  public filename_arr: Array<any> = [];
  public imags: Array<any> = [];
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
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
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
            this.openImage(this.cam.PictureSourceType.SAVEDPHOTOALBUM);
          }
        }
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

  openImage(SourceType) {
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
        //make SaveData button enable
        this.isdisabled = false;
        this.ext = ".jpg";
        let textfile = this.createFileName(this.ext);
        this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
        this.TollenObj.FileDetails.push(textfile);
        this.TollenObj.Files.push(imageData);
        this.imags.push(this.captureDataUrl);
        ////////////////////////////////////////
        // //resolve the image path 
        // this.filePath.resolveNativePath(imageData).then(filePath => {
        //   this.ext = ".jpg"; //type of extension in image
        //   //if gallery button click
        //   if (SourceType === this.cam.PictureSourceType.SAVEDPHOTOALBUM) {
        //     let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1); //path without name
        //     let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?')); //file name
        //     this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.ext));
        //   }
        //   else {
        //     //if camera button click
        //     var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        //     var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        //     this.copyFileToLocalDir(correctPath, currentName, this.createFileName(this.ext));
        //   }
        // }, (err: Error) => {
        //   this.errortext = "path : " + err.message;
        // });
      }   
    }).catch(
      (e: Error) => { this.filename = e.message; }
      )
  }
  //Copy the image to a local folder
  public copyFileToLocalDir(namePath, currentName, newFileName: string) {
    //copy the new file 
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      //the image appear in page
      this.captureDataUrl = this.file.dataDirectory + newFileName;
      this.imags.push(this.captureDataUrl);
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

  // base64ToArrayBuffer(base64) {
  //   var binary_string = window.atob(base64);
  //   var len = binary_string.length;
  //   var bytes = new Uint8Array(len);
  //   for (var i = 0; i < len; i++) {
  //     bytes[i] = binary_string.charCodeAt(i);
  //   }
  //   return bytes.buffer;
  // }

  public BASE64_MARKER = ';base64,';

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

  //upload the text written in textarea
  uploadtext() {
    let str_file = this.disc.trim();
    if (str_file == '') {
      let toast = this.toastCtrl.create({
        message: "Text file is empty...",
        duration: 2000,
        position: 'middle',
        cssClass: "tryempty.scss"
      });
      toast.present();
    }
    else {
      this.ext = ".txt";
      let textfile = this.createFileName(this.ext);
      //write text on file
      this.file.writeFile(this.file.dataDirectory, textfile, this.disc, { replace: true })
        .then((data) => {
          let uri = this.file.dataDirectory;
          this.filename = textfile;
          this.correctPath = uri;
          this.file.readAsDataURL(uri, textfile).then((b_data) => {
            let ff = this.convertDataURIToBinary(b_data)
            let arr = Array.from(ff);
            this.filename_arr.push(arr);
            this.TollenObj.Files.push(arr);
          })
          this.TollenObj.FileDetails.push(textfile);
          this.filename_arr.push(textfile);
        })
        .catch((e: Error) => {
          this.errortext = "writeFile error : " + e.message;
          let toast = this.toastCtrl.create({
            message: "Sorry, Error to write file, Please try again.",
            duration: 3000,
            position: 'middle',
            cssClass: "tryerror.scss"
          });
          toast.present();
        });
      this.isdisabled = false;
    }
  }
  //
  uploadfile() {
    this.fileChooser.open().then((uri) => {    
      this.ext = ".txt";
      this.filePath.resolveNativePath(uri).then(filePath => {
        let textfile = filePath.substr(filePath.lastIndexOf('/') + 1);
        let edit_path = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('?'));
        this.filename = textfile;
        this.correctPath = edit_path;
        this.file.readAsDataURL(this.correctPath, this.filename).then((b_data) => {
          this.filename = b_data;
          let ff = this.convertDataURIToBinary(b_data)
          let arr = Array.from(ff);
          this.filename_arr.push(arr);
          this.TollenObj.FileDetails.push(textfile);
          this.TollenObj.Files.push(arr);
        }).catch((e: Error) => {
          this.errortext = "readAsDataURL error : " + e.message;
          
        })
      }).catch((e: Error) => { this.errortext = "resolveNativePath error : " + e.message })
      this.filename_arr.push(this.filename);
    })
      //     .catch((err: Error) => {
      //     this.errortext = "filePath error : " + err.message;
      //     let toast = this.toastCtrl.create({
      //       message: "Sorry, Error to get file, Please try again.",
      //       duration: 3000,
      //       position: 'middle',
      //       cssClass: "tryerror.scss"
      //     });
      //     toast.present();
      //   })
      //   this.isdisabled = false;
      // })
      .catch((e: Error) => {
        this.errortext = "fileChooser error : " + e.message;
        let toast = this.toastCtrl.create({
          message: "Sorry, Error to open file, Please try again.",
          duration: 3000,
          position: 'middle',
          cssClass: "tryerror.scss"
        });
        toast.present();
      });
    this.isdisabled = false;
  }

  //
  SaveData() {
    let user: any = this.storage.get("User").then((user) => {
      this.TollenObj.CompanyId = user.CompanyId;
      this.TollenObj.Language = user.Language;
    })
    this.TollenObj.TaskId = this.coming_Task.id;
    let loader = this.loadingCtrl.create({
      content: "Loading Documentations..."
    });
    //loader.present().then(() => {
    this.tasksService.saveData(this.TollenObj).subscribe((data) => {
      //if (data) {
      this.viewCtrl.dismiss(this.TollenObj)
      //loader.dismiss();
      // this.viewCtrl.onDidDismiss(()=>{
      //    loader.dismiss();       
      // })
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
      console.log("The bloody Error Page>>", err);
      this.errortext = err.message;
    });
    //});
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

  /////////////////////////////////////////////////////

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


  // let options1: FileUploadOptions = {
  //           fileKey: 'file',
  //           fileName: 'name.pdf',
  //           params: { resume: uri },
  //           chunkedMode: false,
  //           headers: { Authorization: localStorage.getItem('token') }
  //         }
  //         const fileTransfer: FileTransferObject = this.transfer.create();
  //         fileTransfer.upload(uri, "", options1)
  //           .then(
  //           (data) => {
  //             this.errortext = JSON.stringify(data)
  //           },
  //           (err) => {
  //             this.errortext = "error choose"
  //           }
  //           )







}
