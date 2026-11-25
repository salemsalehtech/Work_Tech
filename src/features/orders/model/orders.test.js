import { countOrders, filterOrders } from './orders';

const orders = [
  { id: 'WT-10007', status: 'delivered', items: [{ name: 'Cloud headset' }] },
  {
    id: 'WT-10005',
    status: 'placed',
    items: [{ name: 'Zenbook 14 OLED' }, { name: 'G305 mouse' }],
  },
  { id: 'WT-10003', status: 'shipped', items: [{ name: 'Legion 5' }] },
  { id: 'WT-10006', status: 'cancelled', items: [{ name: 'Nitro V' }] },
];
const idsOf = (filter, query = '') => filterOrders(orders, { filter, query }).map(({ id }) => id);

it('shows every order, in the order it came', () => {
  expect(idsOf('all')).toEqual(['WT-10007', 'WT-10005', 'WT-10003', 'WT-10006']);
  expect(idsOf('unknown')).toHaveLength(4);
});

it('groups the open statuses', () => {
  expect(idsOf('inProgress')).toEqual(['WT-10005', 'WT-10003']);
  expect(idsOf('cancelled')).toEqual(['WT-10006']);
});

it('searches the number and the products, inside the filter', () => {
  expect(idsOf('all', ' wt-10005 ')).toEqual(['WT-10005']);
  expect(idsOf('all', 'mouse')).toEqual(['WT-10005']);
  expect(idsOf('delivered', 'mouse')).toEqual([]);
});

it('counts the orders of a filter', () => {
  expect(countOrders(orders, 'all')).toBe(4);
  expect(countOrders(orders, 'inProgress')).toBe(2);
});
