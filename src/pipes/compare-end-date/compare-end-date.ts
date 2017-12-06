import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compareEndDate',
})
export class CompareEndDatePipe implements PipeTransform {
  transform(EDate: string, ...args) {
    return new Date(EDate).setHours(0,0,0,0) > new Date().setHours(0,0,0,0);
  }
}
