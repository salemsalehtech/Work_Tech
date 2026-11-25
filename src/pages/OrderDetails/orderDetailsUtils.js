/**
 * Maps order status to valid Badge tone from @shared/components/ui/Badge
 * Valid tones: 'placed' | 'neutral' | 'blue' | 'success' | 'drop'
 */
export function getStatusBadgeTone(status) {
  switch (status) {
    case 'placed':
      return 'placed';
    case 'processing':
      return 'drop';
    case 'delivered':
      return 'success';
    case 'shipped':
    case 'cancelled':
    default:
      return 'neutral';
  }
}

/**
 * Formats order date string with locale support.
 */
export function formatOrderDate(dateString, lang = 'en') {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Validates whether the given order belongs to the currently authenticated user.
 */
export function isOrderOwnedByUser(order, user) {
  if (!order || !user) return false;
  const orderOwnerId = order.userId;
  const currentUserId = user.id;
  if (!orderOwnerId || !currentUserId) return false;
  return String(orderOwnerId) === String(currentUserId);
}
