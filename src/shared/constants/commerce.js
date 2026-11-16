// Business rules shared by cart, checkout and orders (SAD v1.2).
export const CURRENCY = 'EGP';
export const FREE_SHIPPING_THRESHOLD = 20000;
export const SHIPPING_FEE = 150;
export const EXPRESS_FEE = 150;
export const EXPRESS_CITIES = ['Cairo', 'Giza'];
export const COD_MAX_TOTAL = 50000;
export const MAX_QTY_PER_ITEM = 5;
export const MAX_COMPARE_ITEMS = 3;
export const LOW_STOCK_AT = 5;
export const INSTALLMENT_PLANS = [6, 12, 24, 36];
export const DEFAULT_INSTALLMENT_MONTHS = 24;

// Promo codes (SAD v1.2): percent off the subtotal, capped at max EGP. Codes are not case-sensitive.
export const PROMO_CODES = {
  WELCOME10: { percent: 10, max: 2000 },
};
