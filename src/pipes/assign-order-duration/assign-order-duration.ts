import { Pipe, PipeTransform } from '@angular/core';
export enum DurationsEnum{
  "1 "=1,'0.25 ','0.5 '
}
@Pipe({
  name: 'assignOrderDuration',
})
export class AssignOrderDurationPipe implements PipeTransform {
  transform(Dur: string, ...args) {
    return DurationsEnum[Dur];
  }
}
