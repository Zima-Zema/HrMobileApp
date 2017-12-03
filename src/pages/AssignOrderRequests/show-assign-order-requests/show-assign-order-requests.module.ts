import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowAssignOrderRequestsPage } from './show-assign-order-requests';
import { PipesModule } from "../../../pipes/pipes.module";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ShowAssignOrderRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowAssignOrderRequestsPage),
    PipesModule,
    TranslateModule
  ],
})
export class ShowAssignOrderRequestsPageModule {}
