import { Pipe, PipeTransform } from '@angular/core';
export enum DurationsEnum{
  "1 day"=1,'0.25 day','0.5 day'
}
@Pipe({
  name: 'assignOrderDuration',
})
export class AssignOrderDurationPipe implements PipeTransform {
  transform(Dur: string, ...args) {
    return DurationsEnum[Dur];
  }
}
