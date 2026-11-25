import { DEFAULT_INSTALLMENT_MONTHS } from '@shared/constants';

/** Monthly installment shown under every price: price ÷ months, rounded, no interest. */
export function monthlyInstallment(price, months = DEFAULT_INSTALLMENT_MONTHS) {
  if (!months || months < 1) return price;
  return Math.round(price / months);
}

/** Discount in whole percent when oldPrice is higher than price, else 0. */
export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * The chosen label of every option group: the requested one when it exists, else the first (delta 0).
 * resolveSelection(options, { memory: '32 GB' }) → { memory: '32 GB', storage: '512 GB', warranty: '1 year' }
 */
export function resolveSelection(options = {}, requested = {}) {
  return Object.fromEntries(
    Object.entries(options).map(([group, items]) => {
      const chosen = items.find((item) => item.label === requested[group]) ?? items[0];
      return [group, chosen.label];
    }),
  );
}

/**
 * Unit price of a laptop with the chosen options.
 * selection = { memory: '32 GB', storage: '1 TB', warranty: '2 years' }; unknown labels add 0.
 */
export function priceWithOptions(basePrice, options = {}, selection = {}) {
  return Object.entries(selection).reduce((total, [group, label]) => {
    const option = options[group]?.find((item) => item.label === label);
    return total + (option?.delta ?? 0);
  }, basePrice);
}
