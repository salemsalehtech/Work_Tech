import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer } from '@features/auth';
import { useGetOrdersQuery } from '@features/orders';

import Orders from '.';

vi.mock('../../features/orders/api/ordersApi', () => ({
  ordersApi: {},
  useGetOrdersQuery: vi.fn(),
  useUpdateOrderStatusMutation: vi.fn(),
}));

const order = (id, status, name) => ({
  id,
  status,
  createdAt: '2026-11-08T10:00:00Z',
  items: [{ productId: name, name, quantity: 1 }],
  totals: { total: 45990 },
});
const orders = [
  order('WT-10005', 'placed', 'Zenbook 14 OLED'),
  order('WT-10001', 'delivered', 'Legion 5'),
];

function Search() {
  return <output>{useLocation().search}</output>;
}

function renderOrders(route = '/orders', data = orders) {
  useGetOrdersQuery.mockReturnValue({ data, isLoading: false });
  renderWithProviders(
    <>
      <Orders />
      <Search />
    </>,
    {
      route,
      reducer: { auth: authReducer },
      preloadedState: { auth: { userId: 'demo-user-1', accounts: [] } },
    },
  );
}

it('lists the orders of the signed-in user', () => {
  renderOrders();

  expect(useGetOrdersQuery).toHaveBeenCalledWith('demo-user-1');
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByRole('link', { name: 'View order WT-10005' })).toHaveAttribute(
    'href',
    '/orders/WT-10005',
  );
});

it('filters by status and keeps it in the URL', async () => {
  renderOrders();

  await userEvent.click(screen.getByRole('radio', { name: /Delivered/ }));

  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByText('?status=delivered')).toBeInTheDocument();
});

it('opens a link with its search', () => {
  renderOrders('/orders?q=zenbook');

  expect(screen.getByRole('article', { name: 'Order WT-10005' })).toBeInTheDocument();
  expect(screen.getByText('1 of 2 orders')).toBeInTheDocument();
});

it('keeps the typed search with the filter in the URL', async () => {
  renderOrders('/orders?status=delivered');

  await userEvent.type(screen.getByRole('searchbox'), 'legion');

  expect(screen.getByRole('searchbox')).toHaveValue('legion');
  expect(screen.getByText('?status=delivered&q=legion')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(1);
});

it('clears the filters when nothing matches', async () => {
  renderOrders('/orders?status=cancelled');

  await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

  expect(screen.getAllByRole('article')).toHaveLength(2);
});

it('invites to shop when there are no orders', () => {
  renderOrders('/orders', []);

  expect(screen.getByRole('link', { name: 'Browse laptops' })).toHaveAttribute('href', '/products');
});
