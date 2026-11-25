import { describe, expect, it } from 'vitest';

import { formatOrderDate, getStatusBadgeTone, isOrderOwnedByUser } from './orderDetailsUtils';

describe('orderDetailsUtils', () => {
  describe('getStatusBadgeTone', () => {
    it('returns "placed" for placed status', () => {
      expect(getStatusBadgeTone('placed')).toBe('placed');
    });

    it('returns "drop" for processing status', () => {
      expect(getStatusBadgeTone('processing')).toBe('drop');
    });

    it('returns "neutral" for shipped and cancelled statuses', () => {
      expect(getStatusBadgeTone('shipped')).toBe('neutral');
      expect(getStatusBadgeTone('cancelled')).toBe('neutral');
    });

    it('returns "success" for delivered status', () => {
      expect(getStatusBadgeTone('delivered')).toBe('success');
    });

    it('returns "neutral" for unknown status', () => {
      expect(getStatusBadgeTone('unknown')).toBe('neutral');
      expect(getStatusBadgeTone(null)).toBe('neutral');
    });
  });

  describe('formatOrderDate', () => {
    it('formats ISO dates correctly in English', () => {
      const result = formatOrderDate('2026-11-08T16:20:00Z', 'en');
      expect(result).toContain('2026');
      expect(result).toContain('Nov');
      expect(result).toContain('8');
    });

    it('formats ISO dates correctly in Arabic', () => {
      const result = formatOrderDate('2026-11-08T16:20:00Z', 'ar');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).toContain('نوفمبر');
      expect(result).toContain('٢٠٢٦');
    });

    it('returns empty string for invalid dates', () => {
      expect(formatOrderDate(null)).toBe('');
      expect(formatOrderDate('invalid-date')).toBe('');
    });
  });

  describe('isOrderOwnedByUser', () => {
    it('returns true when order.userId matches user.id', () => {
      const order = { id: 'WT-10005', userId: 'demo-user-1' };
      const user = { id: 'demo-user-1' };
      expect(isOrderOwnedByUser(order, user)).toBe(true);
    });

    it('returns false when order.userId does not match user.id', () => {
      const order = { id: 'WT-10005', userId: 'demo-user-1' };
      const user = { id: 'demo-user-2' };
      expect(isOrderOwnedByUser(order, user)).toBe(false);
    });

    it('returns false when order or user is missing', () => {
      expect(isOrderOwnedByUser(null, { id: 'demo-user-1' })).toBe(false);
      expect(isOrderOwnedByUser({ userId: 'demo-user-1' }, null)).toBe(false);
      expect(isOrderOwnedByUser({}, {})).toBe(false);
    });
  });
});
