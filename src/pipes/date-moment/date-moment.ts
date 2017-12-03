import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
@Pipe({
  name: 'dateMoment',
})
export class DateMomentPipe implements PipeTransform {
  lang;
  constructor(translate: TranslateService) {
    this.lang = translate.getDefaultLang();
  }
  transform(value: string, ...args) {
    if (this.lang === 'ar') {
      moment.locale('ar-sa');
      if (value == null || value == "") { return null }
      else {
        return moment(value).format('ddd,DD MMM, YYYY');
      }
    }
    else {
      moment.locale('en');
      if (value == null || value == "") { return null }
      else {
        return moment(value).format('ddd, MMM DD, YYYY');
      }
    }

  }
}
