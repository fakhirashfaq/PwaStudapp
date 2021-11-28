import { ExpiryDatePipe } from './expiry-date.pipe';

describe('ExpiryDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ExpiryDatePipe();
    expect(pipe).toBeTruthy();
  });
});
