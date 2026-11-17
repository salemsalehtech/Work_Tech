import { CURRENCY } from '@shared/constants';

const LOCALES = { en: 'en-US', ar: 'ar-EG' };
const CURRENCY_LABEL = { en: CURRENCY, ar: 'ج.م.' };

/**
 * Formats a whole number with the digits and grouping of the given language.
 * formatNumber(45990) → "45,990" · formatNumber(45990, 'ar') → "٤٥٬٩٩٠"
 */
export function formatNumber(value, lang = 'en') {
  return new Intl.NumberFormat(LOCALES[lang] ?? LOCALES.en, { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
}

/**
 * Formats a price in whole pounds, the way the design shows it.
 * formatPrice(45990) → "45,990 EGP" · formatPrice(45990, 'ar') → "٤٥٬٩٩٠ ج.م."
 */
export function formatPrice(value, lang = 'en') {
  return `${formatNumber(value, lang)} ${CURRENCY_LABEL[lang] ?? CURRENCY_LABEL.en}`;
}
