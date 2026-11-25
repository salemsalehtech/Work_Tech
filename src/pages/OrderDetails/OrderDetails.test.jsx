import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer } from '@features/auth';
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '@features/orders';

import OrderDetails from '.';

vi.mock('../../features/orders/api/ordersApi', () => ({
  ordersApi: {},
  useGetOrderQuery: vi.fn(),
  useUpdateOrderStatusMutation: vi.fn(),
}));

const placed = {
  id: 'WT-10005',
  userId: 'demo-user-1',
  status: 'placed',
  createdAt: '2026-11-08T10:00:00Z',
  items: [
    {
      productId: 'asus-zenbook-14',
      kind: 'laptop',
      name: 'Zenbook 14 OLED',
      price: 76999,
      quantity: 1,
      options: { memory: '16 GB', storage: '512 GB', warranty: '1 year' },
    },
    {
      productId: 'acc-mouse',
      kind: 'accessory',
      name: 'G305 mouse',
      price: 1290,
      quantity: 2,
      options: null,
    },
  ],
  shipping: {
    fullName: 'Marwan Tarek',
    phone: '01022334455',
    city: 'Cairo',
    address: '16 El Tayaran St',
  },
  payment: { method: 'cod' },
  totals: { subtotal: 79579, shipping: 0, discount: 0, total: 79579 },
};
const updateStatus = vi.fn();

function renderOrder(result) {
  useGetOrderQuery.mockReturnValue({ isLoading: false, isError: false, ...result });
  renderWithProviders(
    <Routes>
      <Route path="/orders/:id" element={<OrderDetails />} />
    </Routes>,
    {
      route: '/orders/WT-10005',
      reducer: { auth: authReducer },
      preloadedState: { auth: { userId: 'demo-user-1', accounts: [] } },
    },
  );
}

beforeEach(() => {
  updateStatus.mockReset();
  useUpdateOrderStatusMutation.mockReturnValue([updateStatus, {}]);
});

it('shows the items, the address, the payment and the total', () => {
  renderOrder({ data: placed });

  expect(screen.getByRole('link', { name: 'Zenbook 14 OLED' })).toHaveAttribute(
    'href',
    '/products/asus-zenbook-14',
  );
  expect(screen.queryByRole('link', { name: 'G305 mouse' })).not.toBeInTheDocument();
  expect(screen.getByText('16 El Tayaran St')).toBeInTheDocument();
  expect(screen.getByText('Cash on delivery')).toBeInTheDocument();
  expect(screen.getByRole('complementary')).toHaveTextContent('79,579 EGP');
});

it('marks the current step', () => {
  renderOrder({ data: { ...placed, status: 'shipped' } });

  expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('With courier');
});

it('cancels a placed order after it asks', async () => {
  renderOrder({ data: placed });

  await userEvent.click(screen.getByRole('button', { name: 'Cancel order' }));
  expect(updateStatus).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Yes, cancel it' }));

  expect(updateStatus).toHaveBeenCalledWith({ id: 'WT-10005', status: 'cancelled' });
});

it.each(['processing', 'shipped', 'delivered', 'cancelled'])(
  'cannot cancel a %s order',
  (status) => {
    renderOrder({ data: { ...placed, status } });

    expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument();
  },
);

it('says when cancelling failed', () => {
  useUpdateOrderStatusMutation.mockReturnValue([updateStatus, { isError: true }]);
  renderOrder({ data: placed });

  expect(screen.getByRole('alert')).toHaveTextContent('The order was not cancelled. Try again.');
});

it.each([
  ['missing', { isError: true, error: { status: 404 } }],
  ["another user's", { data: { ...placed, userId: 'someone-else' } }],
])('hides a %s order', (name, result) => {
  renderOrder(result);

  expect(screen.getByRole('heading', { name: 'Order not found' })).toBeInTheDocument();
  expect(screen.queryByText('Marwan Tarek')).not.toBeInTheDocument();
});
