import { Injectable } from '@angular/core';
import { formatNumber } from '@angular/common';
import { EnumValue } from '@angular/compiler-cli/src/ngtsc/metadata';
import { FleetSubSegment } from '../types/fleet-segment';
import { LicenceStatus } from '../types/licence';

@Injectable()
export class Utils {

  protected static utils: Utils;

  public static display(val: number, alternate: number | string = '-'): string {
    return val !== null ? formatNumber(val, 'en-IE', '1.3-3')
                        : typeof alternate === 'number' ? formatNumber(alternate, 'en-IE', '1.3-3') : alternate;
  }
  public static displayWithoutPadding(val: number, alternate: string = '-'): string {
    return val !== null ? formatNumber(val, 'en-IE') : alternate;
  }
  public static displayPercentage(val: number, alternate: string = '-'): string {
    return val !== null ? '(' + Utils.displayWithoutPadding(val) + '%)' : alternate;
  }

  public static toDate(val: string | Date): Date {

    let date: Date = null;

    if (val instanceof Date) {
      return val;
    }

    // val should be in format dd/mm/yyyy or dd/mm/yyyy hh:mm  (24hr time)
    if (val) {
      const elements: Array<string> = val.split('/');
      if (elements.length === 3) {
        // Date constructor expects date string to be in US format mm/dd/yy

        // element[2] may also contain a time eg 2019 10:45
        const lastElement: Array<string> = elements[2].split(' ');

        const mmddyyyy: string = elements[1] + '/' + elements[0] + '/' + lastElement[0];
        date = new Date(mmddyyyy);

        if (lastElement[1]) {
          const time: Array<string> = lastElement[1].split(':');
          date.setHours(parseInt(time[0], 10));
          date.setMinutes(parseInt(time[1], 10));
        }
      }
    }

    return date;
  }

  public static dynamicWidth(value: string, placeHolder: string = value): string {
    const width: string = value.length ? Math.max(value.length * 0.66, placeHolder.length * 0.5) + 'em' : '0';
    // console.log('dynamic width of (value: ' + value + ', placeHolder: ' + placeHolder + ' = ' + width);
    return width;
  }

  constructor() { }

  // provide access to static member functions in html
  static getInstance(): Utils {
    if (!this.utils) {
      this.utils = new Utils();
    }
    return this.utils;
  }

  public static displayEnumText(enumValue: number, enumType: string): string {
    let text: string = '';

    if (enumType[enumValue]) {
      text = enumType[enumValue].replace(/_/g, ' ');

      if (enumType === 'FleetSubSegment')  {

      }
    } else {
      text = String(enumValue);
    }

    return text;
  }
}
