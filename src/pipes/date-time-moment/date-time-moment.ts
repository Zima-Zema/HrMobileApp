
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
@Pipe({
  name: 'dateTimeMoment',
})
export class DateTimeMomentPipe implements PipeTransform {
  lang;
  constructor(translate: TranslateService) {
    this.lang = translate.getDefaultLang();
  }
  transform(value: string, ...args) {
    if (this.lang === 'ar') {
      moment.locale('ar-sa');
      if (value == null || value == "") { return null }
      else {
        return moment(value).format('lll');
      }
    }
    else {
      moment.locale('en');
      if (value == null || value == "") { return null }
      else {
        return moment(value).format('lll');
      }
    }

  }
}
