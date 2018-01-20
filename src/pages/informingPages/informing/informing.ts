import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ReceivedPage} from '../received/received';
import { NotreceivedPage } from "../notreceived/notreceived";
/**
 * Generated class for the InformingPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */

@IonicPage()
@Component({
  selector: 'page-informing',
  templateUrl: 'informing.html'
})
export class InformingPage {

  receivedRoot = 'ReceivedPage'
  notreceivedRoot = 'NotreceivedPage'


  constructor(public navCtrl: NavController) {}

}
