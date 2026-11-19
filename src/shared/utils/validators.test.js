import { describe, it, expect } from 'vitest';

import { isEgyptianMobile, isEmail } from './validators.js';

describe('isEgyptianMobile', () => {
  it('accept right numbers (010 / 011 / 012 / 015)', () => {
    expect(isEgyptianMobile('01012345678')).toBe(true);
    expect(isEgyptianMobile('01112345678')).toBe(true);
    expect(isEgyptianMobile('01212345678')).toBe(true);
    expect(isEgyptianMobile('01512345678')).toBe(true);
  });

  it('remove first and last spaces', () => {
    expect(isEgyptianMobile('  01012345678  ')).toBe(true);
  });

  it('reject wrong first numbers', () => {
    expect(isEgyptianMobile('01312345678')).toBe(false);
    expect(isEgyptianMobile('01412345678')).toBe(false);
  });

  it('reject wrong length of numbers', () => {
    expect(isEgyptianMobile('0101234567')).toBe(false);
    expect(isEgyptianMobile('010123456789')).toBe(false);
  });

  it('reject letters or symbols', () => {
    expect(isEgyptianMobile('0101234567a')).toBe(false);
    expect(isEgyptianMobile('+201012345678')).toBe(false);
    expect(isEgyptianMobile('010 1234 5678')).toBe(false);
  });

  it('reject empty value', () => {
    expect(isEgyptianMobile('')).toBe(false);
    expect(isEgyptianMobile(undefined)).toBe(false);
  });
});

describe('isEmail', () => {
  it('accept right email syntax', () => {
    expect(isEmail('asmaa@gmail.com')).toBe(true);
    expect(isEmail('asmaa.nehad@worktech.io')).toBe(true);
  });

  it('reject email that does not contain @', () => {
    expect(isEmail('asmaagmail.com')).toBe(false);
  });

  it('reject email that does not have dot', () => {
    expect(isEmail('asmaa@gmail')).toBe(false);
  });

  it('reject spaces', () => {
    expect(isEmail('as maa@gmail.com')).toBe(false);
  });

  it('reject empty value', () => {
    expect(isEmail('')).toBe(false);
  });
});
