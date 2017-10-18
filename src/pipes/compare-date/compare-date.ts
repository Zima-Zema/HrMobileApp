import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compareDate',
})
export class CompareDatePipe implements PipeTransform {

  transform(value: string, ...args) {
    return new Date(value).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0);
  }
}
