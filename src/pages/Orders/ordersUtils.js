/**
 * Maps an order status to the appropriate Badge component tone.
 * Badge tones: ink | blue | value | sale | drop | success | placed | neutral
 */
export function getStatusBadgeTone(status) {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'shipped':
      return 'blue';
    case 'processing':
      return 'neutral';
    case 'placed':
      return 'placed';
    case 'cancelled':
      return 'drop';
    default:
      return 'neutral';
  }
}

/**
 * Formats an ISO date string into a user-friendly date according to locale.
 * e.g. "Oct 14, 2026" or "١٤ أكتوبر ٢٠٢٦"
 */
export function formatOrderDate(isoDate, lang = 'en') {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return String(isoDate);

  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns a new array of orders sorted from newest to oldest by createdAt date.
 * Never mutates the original array.
 */
export function sortOrdersByDate(orders = []) {
  return [...orders].sort((a, b) => {
    const timeA = new Date(a?.createdAt || 0).getTime();
    const timeB = new Date(b?.createdAt || 0).getTime();
    return timeB - timeA;
  });
}

/**
 * Filters orders by status and order number query.
 * Works together simultaneously. Never mutates the original array.
 */
export function filterOrders(orders = [], { status = 'all', query = '' } = {}) {
  const trimmedQuery = query.trim().toLowerCase();
  const normalizedStatus = status ? status.toLowerCase() : 'all';

  return orders.filter((order) => {
    const matchesStatus =
      normalizedStatus === 'all' || !normalizedStatus
        ? true
        : String(order.status || '').toLowerCase() === normalizedStatus;

    const matchesQuery = !trimmedQuery
      ? true
      : String(order.id || '')
          .toLowerCase()
          .includes(trimmedQuery);

    return matchesStatus && matchesQuery;
  });
}
