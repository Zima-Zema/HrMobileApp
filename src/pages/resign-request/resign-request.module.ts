import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResignRequestPage } from './resign-request';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerModule } from 'ion-datepicker';
import { TerminationServicesApi } from '../../shared/TerminationServices';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    ResignRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ResignRequestPage),
    TranslateModule,
    DatePickerModule,
    PipesModule
  ],
  providers:[
    TerminationServicesApi
  ]
})
export class ResignRequestPageModule {}
