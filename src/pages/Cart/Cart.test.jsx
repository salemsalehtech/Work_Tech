import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@/test/renderWithProviders';
import { addItem, cartReducer, useGetAccessoriesQuery } from '@features/cart';

import Cart from '.';

vi.mock('../../features/cart/api/accessoriesApi', () => ({
  accessoriesApi: {},
  useGetAccessoriesQuery: vi.fn(),
}));

const mouse = {
  id: 'acc-mouse',
  kind: 'accessory',
  category: 'mouse',
  name: 'G305 mouse',
  brand: 'Logitech',
  price: 1290,
  stock: 30,
};
const laptop = {
  productId: 'asus-zenbook-14',
  kind: 'laptop',
  name: 'Zenbook 14 OLED',
  brand: 'ASUS',
  price: 10000,
  warrantyDelta: 0,
  options: { memory: '16 GB', storage: '512 GB', warranty: '1 year' },
  stock: 20,
};

const renderCart = (...items) =>
  renderWithProviders(<Cart />, {
    route: '/cart',
    reducer: { cart: cartReducer },
    preloadedState: {
      cart: items.reduce((state, item) => cartReducer(state, addItem(item)), undefined) ?? {
        items: [],
        promoCode: null,
      },
    },
  });
const summary = () => screen.getByRole('complementary', { name: 'Order Summary' });

beforeEach(() => {
  useGetAccessoriesQuery.mockReturnValue({ data: [mouse], isLoading: false, isError: false });
});

it('invites to shop when the cart is empty', () => {
  renderCart();

  expect(screen.getByRole('link', { name: 'Explore Products' })).toHaveAttribute(
    'href',
    '/products',
  );
});

it('updates the total and the delivery when the quantity changes', async () => {
  renderCart(laptop);
  expect(summary()).toHaveTextContent('10,150 EGP');

  await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));

  expect(summary()).toHaveTextContent('20,000 EGP');
  expect(within(summary()).getByText('Free')).toBeInTheDocument();
});

it('stops at five of the same laptop', () => {
  renderCart({ ...laptop, quantity: 5 });

  expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
});

it('adds an accessory and stops suggesting it', async () => {
  const { store } = renderCart(laptop);

  await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

  expect(store.getState().cart.items[1]).toMatchObject({ kind: 'accessory', options: null });
  expect(screen.queryByRole('heading', { name: 'Complete your setup' })).not.toBeInTheDocument();
});

it('rejects an unknown promo code and applies WELCOME10', async () => {
  renderCart(laptop);
  const field = screen.getByRole('textbox', { name: 'Promo Code' });

  await userEvent.type(field, 'nope{Enter}');
  expect(field).toHaveAccessibleDescription('Invalid promo code. Please try again.');

  await userEvent.clear(field);
  await userEvent.type(field, 'welcome10{Enter}');
  expect(summary()).toHaveTextContent('−1,000 EGP');
});
