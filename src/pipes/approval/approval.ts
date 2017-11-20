import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
export enum ApprovalStatusEnum {
  'Draft' = 1, 'Submit', 'Employee Review', 'Manager Review', 'Accepted', 'Approved', 'Cancel Before Accepted', 'Cancel After Accepted', 'Rejected'
}
export enum ArabicApprovalStatusEnum {
  'مسودة' = 1, 'مرسلة', 'مراجعة لدى الموظف', 'مراجعة لدى المدير', 'مقبول', 'مصدق عليه', 'إلغاء الطلب قبل التصديق عليه', 'إالغاء الطلب بعد التصديق عليه', 'مرفوض'
}
@Pipe({
  name: 'approvalPipe',
})
export class ApprovalPipe implements PipeTransform {
  /**
   *
   */
  lang;
  constructor(public translate: TranslateService) {
    this.lang = translate.getDefaultLang();
  }
  transform(stat: number, ApprovStat: string) {
   
    if (this.lang === 'ar') {
      return ArabicApprovalStatusEnum[stat]
    }

    return ApprovalStatusEnum[stat];
  }
}
