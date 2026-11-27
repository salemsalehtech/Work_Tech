const LOCALES = { en: 'en-GB', ar: 'ar-EG' };

/** formatDate('2026-10-14T10:20:00Z') → "14 Oct 2026" · in Arabic → "١٤ أكتوبر ٢٠٢٦" */
export function formatDate(isoDate, lang = 'en') {
  return new Intl.DateTimeFormat(LOCALES[lang] ?? LOCALES.en, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));
}
