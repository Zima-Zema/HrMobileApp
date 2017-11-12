import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransLeavesPage } from './trans-leaves';
import { PipesModule } from "../../../pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    TransLeavesPage,
  ],
  imports: [
    IonicPageModule.forChild(TransLeavesPage),
    PipesModule,
    TranslateModule
  ],
})
export class TransLeavesPageModule {}
