import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'sortedPipe',
})
export class SortedPipe implements PipeTransform {

  transform(value: Array<any>, ...args) {
     return _.sortBy(value, args);
  }
}
