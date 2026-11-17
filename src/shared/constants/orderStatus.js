// Order status values stored in db.json and the tracker step each one reaches.
// processing is shown as "Packed", shipped as "With courier" (Figma labels).
export const ORDER_STATUS = {
  PLACED: 'placed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STEPS = ['placed', 'processing', 'shipped', 'delivered'];

// -1 means the order has no tracker (cancelled).
export const ORDER_STEP_INDEX = {
  placed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export const CANCELLABLE_STATUSES = ['placed'];
