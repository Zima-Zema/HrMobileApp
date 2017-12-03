import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
export enum CalcsMethodEnum{
 'Cash'=1,'Time Compensation'
}
export enum  ArabicCalcsMethodEnum{
  'نقدى'=1,'تعويض وقت'
 }
@Pipe({
  name: 'assignOrderCalcsMethodPipe',
})
export class AssignOrderCalcsMethodPipe implements PipeTransform {
  lang;
  constructor(public translate: TranslateService) {
    this.lang = translate.getDefaultLang();
  }
  transform(calcsValue: string, ...args) {
    if (this.lang === 'ar') {
      return ArabicCalcsMethodEnum[calcsValue];
    }
    return CalcsMethodEnum[calcsValue];
  }
}
