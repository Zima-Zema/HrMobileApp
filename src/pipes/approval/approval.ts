import { Pipe, PipeTransform } from '@angular/core';
export enum ApprovalStatusEnum {
  New = 1, Submit, AprovalEmployeeReview, ManagerReview, Accepted, Approved, CancelBeforeAccepted, CancelAfterAccepted, Rejected
}
@Pipe({
  name: 'approvalPipe',
})
export class ApprovalPipe implements PipeTransform {
  transform(stat: number, ApprovStat:string) {
    return ApprovalStatusEnum[stat];
  }
}
