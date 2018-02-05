import { NgModule } from '@angular/core';
import { ApprovalPipe } from './approval/approval';
import { ImagePipe } from './image/image';
import { DateMomentPipe } from './date-moment/date-moment';
import { CompareDatePipe } from './compare-date/compare-date';
import { CompareEndDatePipe } from './compare-end-date/compare-end-date';
import { AssignOrderDurationPipe } from './assign-order-duration/assign-order-duration';
import { AssignOrderCalcsMethodPipe } from './assign-order-calcs-method/assign-order-calcs-method';
import { SortedPipe } from './sorted/sorted';
import { AssigncomparePipe } from './assigncompare/assigncompare';
import { DateTimeMomentPipe } from './date-time-moment/date-time-moment';
@NgModule({
    declarations: [ApprovalPipe,
        ImagePipe,
        DateMomentPipe,
        CompareDatePipe,
        CompareEndDatePipe,
        AssignOrderDurationPipe,
        AssignOrderCalcsMethodPipe,
        SortedPipe,
        AssigncomparePipe,
    DateTimeMomentPipe],
    imports: [],
    exports: [ApprovalPipe,
        ImagePipe,
        DateMomentPipe,
        CompareDatePipe,
        CompareEndDatePipe,
        AssignOrderDurationPipe,
        AssignOrderCalcsMethodPipe,
        SortedPipe,
        AssigncomparePipe,
    DateTimeMomentPipe]
})
export class PipesModule { }
