import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the DateMomentPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'dateMoment',
})
export class DateMomentPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
/**
 *
 */
lang;
constructor(translate: TranslateService) {
  this.lang=translate.getDefaultLang();
}
  transform(value: string, ...args) {
    if (this.lang === 'ar') {
      moment.locale('ar-sa');
      return moment(value).format('ddd,DD MMM, YYYY');
    }
    else{
      moment.locale('en');
      return moment(value).format('ddd, MMM DD, YYYY');
    }
   
  }
}
