import { EXPRESS_FEE, FREE_SHIPPING_THRESHOLD, PROMO_CODES, SHIPPING_FEE } from '@shared/constants';

/**
 * Cart item (state.cart.items[]):
 * { key, productId, kind: 'laptop' | 'accessory', name, brand, image, specsLine,
 *   price,          // unit price with every chosen option (base + memory + storage + warranty)
 *   warrantyDelta,  // the warranty part of price, 0 for accessories
 *   options,        // { memory, storage, warranty } labels, or null for accessories
 *   quantity, stock }
 */

/** The same laptop with different options is a different cart line. */
export function cartItemKey(productId, options) {
  if (!options) return productId;
  return [productId, options.memory, options.storage, options.warranty].join('|');
}

/** 0 from FREE_SHIPPING_THRESHOLD, else SHIPPING_FEE. Express adds EXPRESS_FEE on top. */
export function calcShipping(subtotal, { express = false } = {}) {
  if (subtotal <= 0) return 0;
  const base = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return express ? base + EXPRESS_FEE : base;
}

/** { code, discount } for a known code (case-insensitive), or null. */
export function calcPromo(code, subtotal) {
  const normalized = code?.trim().toUpperCase();
  const rule = normalized ? PROMO_CODES[normalized] : undefined;
  if (!rule) return null;
  return {
    code: normalized,
    discount: Math.min(Math.round((subtotal * rule.percent) / 100), rule.max),
  };
}

/**
 * Totals for the cart, checkout and the saved order.
 * - subtotal: everything in the cart (saved as order.totals.subtotal)
 * - warranty: the warranty part of subtotal, shown as its own "Extended warranty" row
 * - products: subtotal − warranty, shown as the "Subtotal" row
 */
export function calcCartTotals(items, { promoCode = null, express = false } = {}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const warranty = items.reduce((sum, item) => sum + (item.warrantyDelta ?? 0) * item.quantity, 0);
  const promo = calcPromo(promoCode, subtotal);
  const discount = promo?.discount ?? 0;
  const shipping = calcShipping(subtotal, { express });
  return {
    products: subtotal - warranty,
    warranty,
    subtotal,
    discount,
    shipping,
    total: subtotal + shipping - discount,
    promoCode: promo?.code ?? null,
  };
}
