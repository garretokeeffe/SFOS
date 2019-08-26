import { async } from '@angular/core/testing';

// services
import { Utils } from './utils.service';

describe('Utils', () => {

  beforeEach(() => {  });

  it('Formatted number should be displayed with locale separators', async(() => {
    let formattedDisplayed: string = Utils.display(1234);
    expect(formattedDisplayed).toBe('1,234.000');
  }));

  it('Null values should be displayed as -', async(() => {
    let formattedDisplayed: string = Utils.display(null);
    expect(formattedDisplayed).toBe('-');
  }));

  it('Null values should be displayed as 0', async(() => {
    let formattedDisplayed: string = Utils.display(null, '0');
    expect(formattedDisplayed).toBe('0');
  }));
});
