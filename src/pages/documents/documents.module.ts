import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsPage } from './documents';
import { FileTransfer } from '@ionic-native/file-transfer';


@NgModule({
  declarations: [
    DocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentsPage),
  ],
  providers: [
    FileTransfer
  ]
})
export class DocumentsPageModule {}
