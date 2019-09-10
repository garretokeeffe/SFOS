import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'contain',
    pure: false
})

export class Contain implements PipeTransform {
  transform(source, value, attribute, startWith, anywhere:boolean = false) : boolean {
    let result = false;
    if(source && value){
      if (source instanceof Array) {
        if (!attribute || attribute === null) {
          result = (source.filter(elem=>elem === value)).length > 0;
        }
        else {
          let attributes = attribute.split('.');
          if(attributes.length === 2){
            if (!startWith) {
              if (value instanceof Array) {
                value.forEach((dat) => {
                  if ((source.filter(elem=>elem[attributes[0]][attributes[1]] === dat)).length > 0) {
                    result = true;
                  }
                });
              }
              else {
                result = (source.filter(elem=>elem[attributes[0]][attributes[1]] === value)).length > 0;
              }
            }
            else {
              if (value instanceof Array) {
                // Place source and value are Arrays and start with  here if/when required
              }
              else {
                result = (source.filter(elem=> elem[attributes[0]][attributes[1]] && elem[attributes[0]][attributes[1]].indexOf(value) === 0)).length > 0;
              }
            }
          }else{
            if (!startWith) {
              if (value instanceof Array) {
                value.forEach((dat) => {
                  if ((source.filter(elem=>elem[attribute] === dat)).length > 0) {
                    result = true;
                  }
                });
              }
              else {
                result = (source.filter(elem=>elem[attribute] === value)).length > 0;
              }
            }
            else {
              if (value instanceof Array) {
                // Place source and value are Arrays and start with  here if/when required
              }
              else {
                result = (source.filter(elem=> elem[attribute] && elem[attribute].indexOf(value) === 0)).length > 0;
              }
            }
          }
        }
      }
      else if (typeof source === 'string') {
        // Place string contains code here if/when required
      }
      else if (typeof source === 'object') {
        if (!attribute || attribute === null) {
          result = source === value;
        }
        else {
          if(attribute instanceof Array) {
            attribute.forEach((dat) => {
              if (startWith) {
                if (source[dat].toLowerCase().indexOf(value.toLowerCase()) == 0) {
                  result = true;
                }
              }
              else {
                if (source[dat].toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                  result = true;
                }
              }
            })
          }
          else {
            if (startWith) {
              result = source[attribute].toLowerCase().indexOf(value.toLowerCase()) == 0;
            }
            else {
              result = source[attribute].toLowerCase().indexOf(value.toLowerCase()) >= 0;
            }
          }
        }
      }
    }
    return result;
  }
}
