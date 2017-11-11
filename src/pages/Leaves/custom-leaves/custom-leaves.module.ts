import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomLeavesPage } from './custom-leaves';
import { PipesModule } from "../../../pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    CustomLeavesPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomLeavesPage),
    PipesModule,
    TranslateModule
  ],
})
export class CustomLeavesPageModule {}
