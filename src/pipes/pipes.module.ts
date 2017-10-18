import { NgModule } from '@angular/core';
import { ApprovalPipe } from './approval/approval';
import { ImagePipe } from './image/image';
import { DateMomentPipe } from './date-moment/date-moment';
import { CompareDatePipe } from './compare-date/compare-date';
import { CompareEndDatePipe } from './compare-end-date/compare-end-date';
@NgModule({
    declarations: [ApprovalPipe,
        ImagePipe,
        DateMomentPipe,
    CompareDatePipe,
    CompareEndDatePipe],
    imports: [],
    exports: [ApprovalPipe,
        ImagePipe,
        DateMomentPipe,
    CompareDatePipe,
    CompareEndDatePipe]
})
export class PipesModule { }
