import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransLeavesPage } from './trans-leaves';
import { PipesModule } from "../../../pipes/pipes.module";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
@NgModule({
  declarations: [
    TransLeavesPage,
  ],
  imports: [
    IonicPageModule.forChild(TransLeavesPage),
    PipesModule,
    TranslateModule,
    GridModule,
    BrowserAnimationsModule,
    FormsModule
  ],
})
export class TransLeavesPageModule {}
