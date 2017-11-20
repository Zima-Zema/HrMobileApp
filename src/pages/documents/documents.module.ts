import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsPage } from './documents';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    DocumentsPage    
  ],
  imports: [
    IonicPageModule.forChild(DocumentsPage),
    ComponentsModule
  ],
  providers: [
    FileTransfer
  ]
})
export class DocumentsPageModule {}
