import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { Globals } from '../globals';

@Pipe({
  name: 'isoDate',
})
export class IsoDatePipe implements PipeTransform {

  // direction:
  //    'from' - (default) convert iso8601 date to dd/mm/yyyy (or other locale) format
  //    'to' - convert dd/mm/yyyy date string to iso8601 format eg 2019-10-05T14:48:00Z
  // time:
  //    true - include time in the formatted response
  //    false - (default) - do not include time in the formatted response

  private static previousLocale: string = null;

  // Regular Expression returns true if the date format is either
  // 2020-10-03T14:49:00Z
  // 2020-10-03
  private static iso8601Format: RegExp = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])(T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z)?)?$/);

  // private static iso8601Format_Original: RegExp = new RegExp(/^(?:[1-9]\d{3}(-?)(?:(?:0[1-9]|1[0-2])\1(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])\1(?:29|30)|(?:0[13578]|1[02])(?:\1)31|00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[0-5]))|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)(?:(-?)02(?:\2)29|-?366))T(?:[01]\d|2[0-3])(:?)[0-5]\d(?:\3[0-5]\d)?(?:Z|[+-][01]\d(?:\3[0-5]\d)?)$/g);
  // private static iso8601Format_Original: RegExp = new RegExp(^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])(T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z)?)?$);

  constructor(private globals: Globals) { }

  public transform(value: string, direction: string = 'from', time: boolean = false): string {

    if (!value) {
      return value;
    }

    if (navigator.language !== IsoDatePipe.previousLocale) {
      moment.locale(navigator.language);
      console.log('IsoDatePipe formatting dates for locale ' + navigator.language);
      IsoDatePipe.previousLocale = navigator.language;
    }

    if (direction.toLowerCase() === 'from') {
      // incoming date value must adhere to ISO8601 standard e.g. 2020-10-03T14:49:00.000Z or 2020-10-03

      try {
        if (!value.match(IsoDatePipe.iso8601Format)) {
          // if (!this.globals.demo) {
            console.error('IsoDatePipe: Invalid ISO8601 date [' + value + '] specified. Date must be in ISO8601 format (eg 2020-10-03T14:49:00.000Z) to be transformed.');
          // }
            return value;
        } else {
          const date: Date = new Date(value);
          let localDate: string;
          if (time) {
            localDate = moment.utc(date).format('L LTS');
          } else {
            localDate = moment.utc(date).format('L');
          }
          return localDate;
        }
      }
      catch (e) {
        console.error('IsoDatePipe: Date [' + value + '] could not be transformed from ISO8601 format.');
        return value;
      }
    } else if (direction.toLowerCase() === 'to') {
      // incoming date value must be in format DD/MM/YYYY hh:mm:ss - UTC time is assumed, / can be any separator
      try {
        const day: number = parseInt(value.slice(0, 2));
        const month: number = parseInt(value.slice(3, 5)) - 1;
        const year: number = parseInt(value.slice(6, 10));
        let hour: number = 0;
        let minute: number = 0;
        let seconds: number = 0;
        if (time) {
          hour = parseInt(value.slice(11, 12));
          minute = parseInt(value.slice(14, 15));
          seconds = parseInt(value.slice(17, 18));
        }
        const isoDate: string = new Date(year, month, day, hour, minute, seconds).toISOString();
        return isoDate;
      }
      catch (e) {
        console.error('IsoDatePipe: Invalid local date value [' + value + '] specified. Must be in the format DD/MM/YYYY where / can be any separator.');
        return value;
      }
    } else {
      console.error('IsoDatePipe: Invalid direction value [' + direction + '] specified. Must be \'from\' or \'to\'.');
    }

    return null;
  }

}
