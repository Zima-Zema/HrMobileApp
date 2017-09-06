import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-add-task',
  templateUrl: 'add-task.html',
})
export class AddTaskPage {
  dateFilter: string;
  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false };
  minDate = new Date().toISOString();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    let tryDate = this.navParams
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTaskPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
  //
  save() {
    let loader = this.loadingCtrl.create({
      content: "Adding Task..."
    });
    loader.present().then(() => {
      this.viewCtrl.dismiss(this.event);
    });
    loader.dismiss();
  }

}
