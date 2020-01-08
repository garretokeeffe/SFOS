import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

// TODO
// 01/05/2016 - 30/04/2017 piped into isoDate: 'To' incorrectly converts to:
// 2016-04-30T23:00:00.000Z - 2017-04-29T23:00:00.000Z

@Pipe({
  name: 'isoDate',
})
export class IsoDatePipe implements PipeTransform {

  // direction:
  //    'from' - (default) convert iso8601 date to dd/mm/yyyy (or other locale) format
  //    'to' - convert dd/mm/yyyy date string to iso8601 format eg 2019-10-05T14:48:00.000Z
  // time:
  //    true - include time in the formatted response
  //    false - (default) - do not include time in the formatted response

  public transform(value: string, direction: string = 'from', time: boolean = false): string {

    if (direction.toLowerCase() === 'from') {
      // incoming date value must adhere to ISO8601 standard e.g. 2020-10-03T14:49:00.000Z

      try {
        const date: Date = new Date(value);
        let localDate: string;
        if (time) {
          localDate = moment.utc(date).format('L LTS');
        } else {
          localDate = moment.utc(date).format('L');
        }
        return localDate;
      }
      catch (e) {
        console.error('IsoDatePipe: Invalid ISO8601 date value [' + value + '] specified. Must be in the format 2020-10-03T14:49:00.000Z');
        return value;
      }
    } else if (direction.toLowerCase() === 'to') {
      // incoming date value must be in format DD/MM/YYYY hh:mm:ss - UTC time is assumed, / can be any separator
      try {
        const day: number = parseInt(value.slice(0, 2));
        const month: number = parseInt(value.slice(3, 5)) - 1;
        const year: number = parseInt(value.slice(6, 10));
        let hour: number = null;
        let minute: number = null;
        let seconds: number = null;
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
