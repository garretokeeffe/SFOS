import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  it('create an instance', () => {
    const pipe: SafePipe = new SafePipe();
    expect(pipe).toBeTruthy();
  });
});
