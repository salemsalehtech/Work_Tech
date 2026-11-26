import { MAX_QTY_PER_ITEM } from '@shared/constants';
import { priceWithOptions, resolveSelection } from '@shared/utils';

/** Most units of one line (BR-03). */
export const quantityLimit = (stock) => Math.min(stock, MAX_QTY_PER_ITEM);

/**
 * Cart line of a laptop or an accessory (shape in cartTotals.js).
 * Options that are not chosen take their default, so a card and the product page give the same line.
 */
export function toCartItem(
  product,
  { selection, specsLine = product.specsLine, quantity = 1 } = {},
) {
  const isAccessory = product.kind === 'accessory';
  const options = isAccessory ? null : resolveSelection(product.options, selection);

  return {
    productId: product.id,
    kind: isAccessory ? 'accessory' : 'laptop',
    name: product.name,
    brand: product.brand,
    image: product.images?.[0] ?? null,
    specsLine,
    price: options ? priceWithOptions(product.price, product.options, options) : product.price,
    warrantyDelta: options
      ? priceWithOptions(0, product.options, { warranty: options.warranty })
      : 0,
    options,
    quantity,
    stock: product.stock,
  };
}
