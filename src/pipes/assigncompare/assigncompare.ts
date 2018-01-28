import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the AssigncomparePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'assigncompare',
})
export class AssigncomparePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(ADate: string, ...args) {
    return new Date(ADate).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0);
  }
}
