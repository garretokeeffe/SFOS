import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false,
})

export class Filter implements PipeTransform {
  public transform(list: any, attribute: string, value: any, startWith?: any) : any[] {
    const attributes: any = attribute.split('.');
    if (!startWith) {
      if (attributes.length === 3) {
        return list.filter((elem: any) => elem[attributes[0]][attributes[1]][attributes[2]] === value);
      }
      else if (attributes.length === 2) {
        return list.filter((elem: any) => elem[attributes[0]][attributes[1]] === value);
      }
      else {
        return list.filter((elem: any) => elem[attribute] === value);
      }
    }
    else {
        return list.filter((elem: any) => elem[attribute].toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) === 0);
    }
  }
}
