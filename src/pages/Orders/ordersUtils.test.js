import { describe, expect, it } from 'vitest';

import { filterOrders, formatOrderDate, getStatusBadgeTone, sortOrdersByDate } from './ordersUtils';

const SAMPLE_ORDERS = [
  { id: 'WT-10001', createdAt: '2026-10-14T10:20:00Z', status: 'delivered' },
  { id: 'WT-10002', createdAt: '2026-10-15T10:20:00Z', status: 'delivered' },
  { id: 'WT-10003', createdAt: '2026-10-27T13:20:00Z', status: 'shipped' },
  { id: 'WT-10004', createdAt: '2026-11-06T16:20:00Z', status: 'processing' },
  { id: 'WT-10005', createdAt: '2026-11-08T16:20:00Z', status: 'placed' },
  { id: 'WT-10006', createdAt: '2026-11-14T19:50:00Z', status: 'cancelled' },
  { id: 'WT-10007', createdAt: '2026-11-10T12:05:00Z', status: 'delivered' },
];

describe('ordersUtils', () => {
  describe('getStatusBadgeTone', () => {
    it('maps all order statuses to correct badge tones', () => {
      expect(getStatusBadgeTone('delivered')).toBe('success');
      expect(getStatusBadgeTone('shipped')).toBe('blue');
      expect(getStatusBadgeTone('processing')).toBe('neutral');
      expect(getStatusBadgeTone('placed')).toBe('placed');
      expect(getStatusBadgeTone('cancelled')).toBe('drop');
      expect(getStatusBadgeTone('unknown')).toBe('neutral');
    });
  });

  describe('formatOrderDate', () => {
    it('formats ISO dates correctly in English', () => {
      const formatted = formatOrderDate('2026-10-14T10:20:00Z', 'en');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Oct');
      expect(formatted).toContain('14');
    });

    it('formats ISO dates correctly in Arabic', () => {
      const formatted = formatOrderDate('2026-10-14T10:20:00Z', 'ar');
      expect(formatted).toBeTruthy();
    });

    it('handles empty or invalid date safely', () => {
      expect(formatOrderDate('')).toBe('');
      expect(formatOrderDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('sortOrdersByDate', () => {
    it('sorts orders from newest to oldest createdAt without mutating original array', () => {
      const copy = [...SAMPLE_ORDERS];
      const sorted = sortOrdersByDate(SAMPLE_ORDERS);

      expect(SAMPLE_ORDERS).toEqual(copy);
      expect(sorted[0].id).toBe('WT-10006'); // 2026-11-14
      expect(sorted[1].id).toBe('WT-10007'); // 2026-11-10
      expect(sorted[2].id).toBe('WT-10005'); // 2026-11-08
      expect(sorted[3].id).toBe('WT-10004'); // 2026-11-06
      expect(sorted[4].id).toBe('WT-10003'); // 2026-10-27
      expect(sorted[5].id).toBe('WT-10002'); // 2026-10-15
      expect(sorted[6].id).toBe('WT-10001'); // 2026-10-14
    });
  });

  describe('filterOrders', () => {
    it('returns all orders when status is "all" and query is empty', () => {
      const result = filterOrders(SAMPLE_ORDERS, { status: 'all', query: '' });
      expect(result).toHaveLength(7);
    });

    it('filters orders by status', () => {
      const delivered = filterOrders(SAMPLE_ORDERS, { status: 'delivered', query: '' });
      expect(delivered).toHaveLength(3);
      expect(delivered.every((o) => o.status === 'delivered')).toBe(true);

      const shipped = filterOrders(SAMPLE_ORDERS, { status: 'shipped', query: '' });
      expect(shipped).toHaveLength(1);
      expect(shipped[0].id).toBe('WT-10003');
    });

    it('filters orders by search query matching order number', () => {
      const searchResult = filterOrders(SAMPLE_ORDERS, { status: 'all', query: '10005' });
      expect(searchResult).toHaveLength(1);
      expect(searchResult[0].id).toBe('WT-10005');

      const caseInsensitive = filterOrders(SAMPLE_ORDERS, { status: 'all', query: 'wt-10004' });
      expect(caseInsensitive).toHaveLength(1);
      expect(caseInsensitive[0].id).toBe('WT-10004');
    });

    it('combines status and search query filtering simultaneously', () => {
      // Both match
      const matchBoth = filterOrders(SAMPLE_ORDERS, { status: 'delivered', query: 'WT-10001' });
      expect(matchBoth).toHaveLength(1);
      expect(matchBoth[0].id).toBe('WT-10001');

      // Status matches but search doesn't
      const noMatchSearch = filterOrders(SAMPLE_ORDERS, { status: 'shipped', query: 'WT-10001' });
      expect(noMatchSearch).toHaveLength(0);

      // Search matches but status doesn't
      const noMatchStatus = filterOrders(SAMPLE_ORDERS, { status: 'cancelled', query: 'WT-10001' });
      expect(noMatchStatus).toHaveLength(0);
    });
  });
});
