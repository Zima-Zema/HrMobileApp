import { NgModule } from '@angular/core';
import { ApprovalPipe } from './approval/approval';
import { ImagePipe } from './image/image';
@NgModule({
	declarations: [ApprovalPipe,
    ImagePipe],
	imports: [],
	exports: [ApprovalPipe,
    ImagePipe]
})
export class PipesModule {}
