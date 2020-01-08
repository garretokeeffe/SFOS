import { IsoDatePipe } from './iso-date.pipe';

describe('IsoDatePipe', () => {
  it('create an instance', () => {
    const pipe = new IsoDatePipe();
    expect(pipe).toBeTruthy();
  });
});
