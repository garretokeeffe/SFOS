import { Pipe, PipeTransform } from '@angular/core';
import { Contain } from './contain.pipe';

@Pipe({
  name: 'unique',
  pure: false,
})

// filter out unique values from an array
export class Unique implements PipeTransform {
  public transform(list: Array<any>, attribute: any) : Array<any> {
    const set = [];
    const contain = new Contain();
    let flag: boolean = false;
    if (!attribute || attribute === null) {
      list.forEach((l) => {
        if ((contain.transform(set, l, null, false)) === false)
          set.push(l);
      });
    }
    else if (attribute instanceof Array) {
      list.forEach((l) => {
        attribute.forEach((element: any) => {
          if ((contain.transform(set, l[element], element, false)) === true) {
            flag = true;  // todo: see if can break out of loop here
          }
        });
        if (flag === false) {
          set.push(l);
        }
        flag = false; // reset flag
      });
    }
    else {
      list.forEach((l) => {
        if ((contain.transform(set, l[attribute], attribute, false)) === false) {
          set.push(l);
        }
      });
    }
    return set;
  }
}
