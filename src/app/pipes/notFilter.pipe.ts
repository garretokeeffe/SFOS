import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'notFilter',
    pure: false
})

export class NotFilter implements PipeTransform {
  transform(list: any, attribute: string, value: any, startWith?: any) : any[] {
    let attributes = attribute.split('.');
    if(!startWith){
      if(attributes.length === 3){
        return list.filter(elem => elem[attributes[0]][attributes[1]][attributes[2]] !== value);
      }
      else if(attributes.length === 2){
        return list.filter(elem => elem[attributes[0]][attributes[1]] !== value);
      }
      else{
        return list.filter(elem => elem[attribute] !== value);
      }
    }
    else{
      return list.filter(elem => elem[attribute].toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== 0);
    }
  }
}
