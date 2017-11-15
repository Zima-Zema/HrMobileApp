import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'sortedPipe',
})
export class SortedPipe implements PipeTransform {

  transform(value: Array<any>, ...args) {
    console.log("sortedPipe : ",value);
    var ss=_.sortBy(value, args);
    console.log("ss : ",ss)
     return _.sortBy(value, args);
  }
}
