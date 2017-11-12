import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustodyListPage } from './custody-list';
import { UtilitiesProvider } from '../../shared/utilities';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CustodyListPage,
  ],
  imports: [
    IonicPageModule.forChild(CustodyListPage),
    TranslateModule
  ],
  providers: [
    UtilitiesProvider
  ]
})
export class CustodyListPageModule { }
