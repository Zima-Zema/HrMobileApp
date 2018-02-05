import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformingPage } from './informing';
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../../pipes/pipes.module";
@NgModule({
  declarations: [
    InformingPage,
  ],
  imports: [
    IonicPageModule.forChild(InformingPage),
    TranslateModule,
    PipesModule
  ]
})
export class InformingPageModule {}
