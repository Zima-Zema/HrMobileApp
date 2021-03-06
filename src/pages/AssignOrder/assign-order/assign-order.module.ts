import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignOrderPage } from './assign-order';
import { AssignOrderServicesApi} from '../../../shared/AssignOrderService';
import { PipesModule } from "../../../pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [
    AssignOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignOrderPage),
    PipesModule,
    TranslateModule
  ],
  providers:[
    AssignOrderServicesApi
  ]
})
export class AssignOrderPageModule {}
