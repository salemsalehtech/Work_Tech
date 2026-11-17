import { calcCartTotals, calcPromo, calcShipping, cartItemKey } from './cartTotals';

const laptop = { price: 47830, warrantyDelta: 1840, quantity: 1 };
const headset = { price: 1890, warrantyDelta: 0, quantity: 1 };

describe('calcShipping', () => {
  it('is free from 20,000 EGP', () => {
    expect(calcShipping(20000)).toBe(0);
    expect(calcShipping(49120)).toBe(0);
  });

  it('is 150 EGP below 20,000 and 0 for an empty cart', () => {
    expect(calcShipping(19999)).toBe(150);
    expect(calcShipping(0)).toBe(0);
  });

  it('adds 150 EGP for express', () => {
    expect(calcShipping(49120, { express: true })).toBe(150);
    expect(calcShipping(1890, { express: true })).toBe(300);
  });
});

describe('calcPromo', () => {
  it('gives 10% with WELCOME10, any case', () => {
    expect(calcPromo(' welcome10 ', 15000)).toEqual({ code: 'WELCOME10', discount: 1500 });
  });

  it('caps the discount at 2,000 EGP', () => {
    expect(calcPromo('WELCOME10', 85000).discount).toBe(2000);
  });

  it('returns null for unknown or empty codes', () => {
    expect(calcPromo('FREE', 15000)).toBeNull();
    expect(calcPromo('', 15000)).toBeNull();
  });
});

describe('calcCartTotals', () => {
  it('splits the warranty from the products and adds free shipping', () => {
    expect(calcCartTotals([laptop, headset])).toEqual({
      products: 47880,
      warranty: 1840,
      subtotal: 49720,
      discount: 0,
      shipping: 0,
      total: 49720,
      promoCode: null,
    });
  });

  it('charges shipping under 20,000 and applies a promo', () => {
    const totals = calcCartTotals([{ ...headset, quantity: 2 }], { promoCode: 'welcome10' });
    expect(totals).toMatchObject({ subtotal: 3780, discount: 378, shipping: 150, total: 3552 });
    expect(totals.promoCode).toBe('WELCOME10');
  });
});

describe('cartItemKey', () => {
  it('keeps different options apart', () => {
    const a = cartItemKey('asus-tuf-f16', { memory: '16 GB', storage: '1 TB', warranty: '1 year' });
    const b = cartItemKey('asus-tuf-f16', { memory: '32 GB', storage: '1 TB', warranty: '1 year' });
    expect(a).not.toBe(b);
    expect(cartItemKey('acc-headset-wired', null)).toBe('acc-headset-wired');
  });
});
