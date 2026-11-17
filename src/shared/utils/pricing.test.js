import { formatNumber, formatPrice } from './formatPrice';
import { discountPercent, monthlyInstallment, priceWithOptions } from './pricing';

describe('formatPrice', () => {
  it('formats English prices as number then EGP', () => {
    expect(formatPrice(45990)).toBe('45,990 EGP');
    expect(formatPrice(1290.6)).toBe('1,291 EGP');
  });

  it('formats Arabic prices with Arabic digits', () => {
    expect(formatPrice(45990, 'ar')).toBe('٤٥٬٩٩٠ ج.م.');
    expect(formatNumber(1916, 'ar')).toBe('١٬٩١٦');
  });
});

describe('monthlyInstallment', () => {
  it('divides by the months and rounds like the design', () => {
    expect(monthlyInstallment(45990)).toBe(1916);
    expect(monthlyInstallment(32490, 24)).toBe(1354);
    expect(monthlyInstallment(45990, 12)).toBe(3833);
  });
});

describe('discountPercent', () => {
  it('returns the rounded percent off', () => {
    expect(discountPercent(38990, 45990)).toBe(15);
    expect(discountPercent(42990, 48990)).toBe(12);
  });

  it('returns 0 without a higher old price', () => {
    expect(discountPercent(45990, null)).toBe(0);
    expect(discountPercent(45990, 45990)).toBe(0);
  });
});

describe('priceWithOptions', () => {
  const options = {
    memory: [
      { label: '16 GB', delta: 0 },
      { label: '32 GB', delta: 5500 },
    ],
    warranty: [
      { label: '1 year', delta: 0 },
      { label: '2 years', delta: 1840 },
    ],
  };

  it('adds the delta of every chosen option', () => {
    expect(priceWithOptions(45990, options, { memory: '32 GB', warranty: '2 years' })).toBe(53330);
  });

  it('ignores labels that do not exist', () => {
    expect(priceWithOptions(45990, options, { memory: '64 GB' })).toBe(45990);
  });
});
