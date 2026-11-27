import { ORDER_STATUS } from '@shared/constants';

// Filters of My orders and the statuses each one shows.
const FILTERS = {
  all: Object.values(ORDER_STATUS),
  inProgress: [ORDER_STATUS.PLACED, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED],
  delivered: [ORDER_STATUS.DELIVERED],
  cancelled: [ORDER_STATUS.CANCELLED],
};

export const ORDER_FILTER_KEYS = Object.keys(FILTERS);

const statusesOf = (filter) => FILTERS[filter] ?? FILTERS.all;

/** Orders of one filter whose number or products match the query. */
export function filterOrders(orders, { filter, query }) {
  const text = query.trim().toLowerCase();
  return orders.filter(
    (order) =>
      statusesOf(filter).includes(order.status) &&
      [order.id, ...order.items.map((item) => item.name)].some((value) =>
        value.toLowerCase().includes(text),
      ),
  );
}

export const countOrders = (orders, filter) =>
  orders.filter((order) => statusesOf(filter).includes(order.status)).length;
