import { Injectable } from '@angular/core';
import { formatNumber } from '@angular/common';
import { EnumValue } from '@angular/compiler-cli/src/ngtsc/metadata';
import { FleetSubSegment } from '../types/fleet-segment';
import { LicenceStatus } from '../types/licence';
import { ApplicantType } from '../types/licence-application';

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
  public static getInstance(): Utils {
    if (!this.utils) {
      this.utils = new Utils();
    }
    return this.utils;
  }

  public static displayEnumText(enumValue: number, enumType: any): string {
    let text: string = '';
    enumValue = Number(enumValue); // ensure it's a number

    if (enumType[enumValue]) {
      text = enumType[enumValue].replace(/_/g, ' ');

      if (enumType === ApplicantType) {
        text = text.toLowerCase();
        if (text) {
          text = text.charAt(0).toUpperCase() + text.slice(1); // capitalise first letter
          text = 'A ' + text;
        }
        if (enumValue === ApplicantType['INDIVIDUAL']) {
          text = 'A Sole Applicant / Myself';
        }
      }
    } else {
      text = String(enumValue);
    }

    return text;
  }

  private static getRoman(value: number): {numThousands: number, romanNumeral: string} {
    const roman: Array<string> = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
    const decimal: Array<number> = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

    let romanNumeral: string = '';
    let numThousands: number = 0;
    for (let i: number = 0; i < roman.length; i++) {
      if (value === 0) break;
      while (value >= decimal[i]) {
        value -= decimal[i];
        romanNumeral += roman[i];
        if (roman[i] === 'M') {
          numThousands++;
        }
      }
    }
    const ret: any = {
      numThousands: numThousands,
      romanNumeral: romanNumeral,
    };
    return ret;
  }

  public static decimalToRoman(value: number): string {
    // 3,888,888 is the longest number represented by Roman numerals
    if (value <= 0 || value > 3888888) {
      return String(value);
    }
    let romanNumeral: string = '';
    const romanO: any = Utils.getRoman(value);
    // If the number is 4000 or greater
    if (romanO.numThousands > 4) {
      let thousandString: string = '';
      for (let j: number = 0; j < romanO.numThousands; j++) {
        thousandString += 'm';
      }
      const thousandsO: any = Utils.getRoman(romanO.numThousands);
      romanNumeral = romanO.romanNumeral.replace(thousandString, thousandsO.romanNumeral);
    }
    else {
      romanNumeral = romanO.romanNumeral;
    }
    return romanNumeral;
  }
}
