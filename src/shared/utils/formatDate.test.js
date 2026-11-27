import { formatDate } from './formatDate';

it('formats the date in the language of the page', () => {
  expect(formatDate('2026-10-14T10:20:00Z')).toBe('14 Oct 2026');
  expect(formatDate('2026-10-14T10:20:00Z', 'ar')).toBe('١٤ أكتوبر ٢٠٢٦');
});
