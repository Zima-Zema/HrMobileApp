import { Pipe, PipeTransform } from '@angular/core';
export enum ApprovalStatusEnum {
  Draft = 1, Submit, ApprovalEmployeeReview, ManagerReview, Accepted, Approved, CancelBeforeAccepted, CancelAfterAccepted, Rejected
}
@Pipe({
  name: 'approvalPipe',
})
export class ApprovalPipe implements PipeTransform {
  transform(stat: number, ApprovStat:string) {
    return ApprovalStatusEnum[stat];
  }
}
