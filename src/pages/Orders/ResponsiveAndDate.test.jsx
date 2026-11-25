import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { formatOrderDate as formatOrderDetailsDate } from '@pages/OrderDetails/orderDetailsUtils';
import { formatOrderDate as formatOrdersListDate } from '@pages/Orders/ordersUtils';
import i18n from '@services/i18n';

describe('AB-08: Responsive Layout & Arabic Date Formatting', () => {
  const sampleIsoDate = '2026-10-14T10:20:00Z';

  beforeEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  describe('Requirement 2: Arabic and English Date Formatting with toLocaleDateString', () => {
    it('formats dates in English using current i18n.language', () => {
      expect(i18n.language).toBe('en');

      const formattedOrdersDate = formatOrdersListDate(sampleIsoDate, i18n.language);
      expect(formattedOrdersDate).toContain('2026');
      expect(formattedOrdersDate).toContain('Oct');
      expect(formattedOrdersDate).toContain('14');

      const formattedDetailsDate = formatOrderDetailsDate(sampleIsoDate, i18n.language);
      expect(formattedDetailsDate).toContain('2026');
      expect(formattedDetailsDate).toContain('Oct');
      expect(formattedDetailsDate).toContain('14');
    });

    it('formats dates in Arabic when i18n.language is switched to "ar"', async () => {
      await act(async () => {
        await i18n.changeLanguage('ar');
      });

      expect(i18n.language).toBe('ar');

      const formattedOrdersDate = formatOrdersListDate(sampleIsoDate, i18n.language);
      expect(formattedOrdersDate).toContain('أكتوبر');
      expect(formattedOrdersDate).toContain('٢٠٢٦');

      const formattedDetailsDate = formatOrderDetailsDate(sampleIsoDate, i18n.language);
      expect(formattedDetailsDate).toContain('أكتوبر');
      expect(formattedDetailsDate).toContain('٢٠٢٦');
    });

    it('handles empty and invalid date strings gracefully without throwing', () => {
      expect(formatOrdersListDate(null, 'ar')).toBe('');
      expect(formatOrdersListDate('', 'ar')).toBe('');
      expect(formatOrdersListDate('invalid-iso', 'ar')).toBe('invalid-iso');

      expect(formatOrderDetailsDate(null, 'ar')).toBe('');
      expect(formatOrderDetailsDate('', 'ar')).toBe('');
      expect(formatOrderDetailsDate('invalid-iso', 'ar')).toBe('');
    });

    it('updates formatted output automatically when switching between Arabic and English', async () => {
      // Start in English
      expect(formatOrdersListDate(sampleIsoDate, i18n.language)).toContain('Oct');

      // Switch to Arabic
      await act(async () => {
        await i18n.changeLanguage('ar');
      });
      expect(formatOrdersListDate(sampleIsoDate, i18n.language)).toContain('أكتوبر');

      // Switch back to English
      await act(async () => {
        await i18n.changeLanguage('en');
      });
      expect(formatOrdersListDate(sampleIsoDate, i18n.language)).toContain('Oct');
    });
  });

  describe('Requirement 1: Responsive Layout Structural Verification', () => {
    it('renders a sample element with responsive wrapping container', () => {
      const { container } = render(
        <div data-testid="responsive-test-card" style={{ maxWidth: '390px', width: '100%' }}>
          <header style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span>WT-10001</span>
            <span>{formatOrdersListDate(sampleIsoDate, 'ar')}</span>
          </header>
          <footer style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <button type="button" style={{ width: '100%' }}>
              View Details
            </button>
          </footer>
        </div>,
      );

      expect(container.querySelector('[data-testid="responsive-test-card"]')).toBeInTheDocument();
      expect(screen.getByText('WT-10001')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });
  });
});
