import { Pipe, PipeTransform } from '@angular/core';
export enum CalcsMethodEnum{
 'Cash'=1,'Time Compensation'
}
@Pipe({
  name: 'assignOrderCalcsMethodPipe',
})
export class AssignOrderCalcsMethodPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(calcsValue: string, ...args) {
    return CalcsMethodEnum[calcsValue];
  }
}
