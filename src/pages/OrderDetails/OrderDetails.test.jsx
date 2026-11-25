import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer, DEMO_USER } from '@features/auth';
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '@features/orders';
import i18n from '@services/i18n';
import { PATHS } from '@shared/constants';

import OrderDetails from './index';

vi.mock('@features/orders', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGetOrderQuery: vi.fn(),
    useUpdateOrderStatusMutation: vi.fn(),
  };
});

const MOCK_ORDER_PLACED = {
  id: 'WT-10005',
  userId: 'demo-user-1',
  createdAt: '2026-11-08T16:20:00Z',
  status: 'placed',
  items: [
    {
      productId: 'apple-macbook-air-13-m5',
      kind: 'laptop',
      name: 'MacBook Air 13 M5',
      price: 84333,
      quantity: 1,
      options: { memory: '16 GB', storage: '512 GB', warranty: '1 year' },
    },
    {
      productId: 'acc-usb-c-hub-7in1',
      kind: 'accessory',
      name: 'USB-C hub, 7-in-1',
      price: 990,
      quantity: 1,
      options: null,
    },
  ],
  shipping: {
    fullName: 'Youssef Adel',
    phone: '01500000138',
    city: 'Mansoura',
    address: '12 El Gomhoria Street',
  },
  payment: {
    method: 'card',
  },
  totals: {
    subtotal: 85323,
    shipping: 0,
    discount: 0,
    total: 85323,
  },
};

const MOCK_ORDER_DELIVERED = {
  id: 'WT-10001',
  userId: 'demo-user-1',
  createdAt: '2026-10-14T10:20:00Z',
  status: 'delivered',
  items: [
    {
      productId: 'lenovo-loq-15irx9',
      kind: 'laptop',
      name: 'Lenovo LOQ 15IRX9 Gaming Laptop',
      price: 66999,
      quantity: 1,
      options: { memory: '16 GB', storage: '1 TB' },
    },
  ],
  shipping: {
    fullName: 'Marwan Tarek',
    phone: '01022334455',
    city: 'Cairo',
    address: '16 El Tayaran St',
  },
  payment: {
    method: 'cod',
  },
  totals: {
    subtotal: 66999,
    shipping: 0,
    discount: 0,
    total: 66999,
  },
};

describe('Order Details & Cancellation (AB-06)', () => {
  let mockUpdateOrderStatus;

  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('en');

    mockUpdateOrderStatus = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ id: 'WT-10005', status: 'cancelled' }),
    });

    useUpdateOrderStatusMutation.mockReturnValue([
      mockUpdateOrderStatus,
      { isLoading: false, isError: false },
    ]);
  });

  const renderOrderDetailsPage = (
    route = '/orders/WT-10005',
    customUser = { ...DEMO_USER, id: 'demo-user-1' },
  ) => {
    return renderWithProviders(
      <Routes>
        <Route path={PATHS.ORDER_DETAILS} element={<OrderDetails />} />
      </Routes>,
      {
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            user: customUser,
            isAuthenticated: Boolean(customUser),
            loading: false,
            error: null,
          },
        },
        route,
      },
    );
  };

  describe('Requirement 1 & 3: Order details retrieval and full info display', () => {
    it('retrieves order by route id and displays complete information', () => {
      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_PLACED,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      expect(useGetOrderQuery).toHaveBeenCalledWith('WT-10005', { skip: false });

      // Header info
      expect(
        screen.getByRole('heading', { level: 1, name: /Order #WT-10005/i }),
      ).toBeInTheDocument();
      expect(screen.getAllByText('Placed').length).toBeGreaterThanOrEqual(1);

      // Products info
      expect(screen.getByText('MacBook Air 13 M5')).toBeInTheDocument();
      expect(screen.getByText('USB-C hub, 7-in-1')).toBeInTheDocument();
      expect(screen.getByText('16 GB')).toBeInTheDocument();
      expect(screen.getByText('512 GB')).toBeInTheDocument();

      // Shipping address
      expect(screen.getByText('Youssef Adel')).toBeInTheDocument();
      expect(screen.getByText('01500000138')).toBeInTheDocument();
      expect(screen.getByText('12 El Gomhoria Street')).toBeInTheDocument();
      expect(screen.getByText('Mansoura')).toBeInTheDocument();

      // Payment & Totals
      expect(screen.getByTestId('payment-method-value')).toHaveTextContent(/Credit \/ Debit Card/i);
      expect(screen.getByTestId('order-grand-total')).toHaveTextContent('85,323 EGP');
    });

    it('renders loading skeleton when query is in loading state', () => {
      useGetOrderQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      expect(screen.getByTestId('order-details-skeleton')).toBeInTheDocument();
    });

    it('renders error state when order fetching fails', () => {
      useGetOrderQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      });

      renderOrderDetailsPage('/orders/WT-10005');

      expect(screen.getByText(/We could not load this/i)).toBeInTheDocument();
    });
  });

  describe('Ownership Validation (Security requirement)', () => {
    it('displays EmptyState and hides private details when order belongs to another user', () => {
      const unauthorizedOrder = {
        ...MOCK_ORDER_PLACED,
        userId: 'demo-user-2', // Different from logged in demo-user-1
      };

      useGetOrderQuery.mockReturnValue({
        data: unauthorizedOrder,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      // Empty state shown
      expect(screen.getByText(/Order not found/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Back to orders/i })).toBeInTheDocument();

      // Private details must NOT be visible
      expect(screen.queryByText('MacBook Air 13 M5')).not.toBeInTheDocument();
      expect(screen.queryByText('Youssef Adel')).not.toBeInTheDocument();
      expect(screen.queryByText('12 El Gomhoria Street')).not.toBeInTheDocument();
      expect(screen.queryByTestId('order-grand-total')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 2: Order tracking with OrderTracker', () => {
    it('displays active step progress for placed order', () => {
      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_PLACED,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      const trackerNav = screen.getByRole('navigation', { name: /Order tracking progress/i });
      expect(trackerNav).toBeInTheDocument();

      const currentStep = screen.getByRole('listitem', { current: 'step' });
      expect(currentStep).toHaveTextContent('Placed');
    });

    it('displays cancelled state when order status is cancelled', () => {
      const cancelledOrder = {
        ...MOCK_ORDER_PLACED,
        status: 'cancelled',
      };

      useGetOrderQuery.mockReturnValue({
        data: cancelledOrder,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      expect(screen.getByRole('status')).toHaveTextContent(/Cancelled/i);
    });
  });

  describe('Requirement 4: Order Cancellation & Confirmation Modal', () => {
    it('shows cancel button for cancellable (placed) order', () => {
      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_PLACED,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');
      expect(screen.getByRole('button', { name: /Cancel order/i })).toBeInTheDocument();
    });

    it('hides cancel button for non-cancellable (delivered) order', () => {
      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_DELIVERED,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10001');
      expect(screen.queryByRole('button', { name: /Cancel order/i })).not.toBeInTheDocument();
    });

    it('opens confirmation modal, cancels order on confirm, and invokes mutation', async () => {
      const user = userEvent.setup();

      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_PLACED,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      const cancelBtn = screen.getByRole('button', { name: /Cancel order/i });
      await user.click(cancelBtn);

      // Modal appears
      const dialog = screen.getByRole('dialog', { name: /Cancel Order/i });
      expect(dialog).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to cancel order WT-10005\?/i),
      ).toBeInTheDocument();

      // Confirm cancellation
      const confirmBtn = screen.getByRole('button', { name: /Yes, cancel order/i });
      await user.click(confirmBtn);

      expect(mockUpdateOrderStatus).toHaveBeenCalledWith({
        id: 'WT-10005',
        status: 'cancelled',
      });

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/has been cancelled successfully/i);
      });
    });

    it('dismisses confirmation modal without sending mutation when clicking Keep order', async () => {
      const user = userEvent.setup();

      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_PLACED,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      await user.click(screen.getByRole('button', { name: /Cancel order/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /Keep order/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
    });

    it('displays error message when cancellation mutation fails', async () => {
      const user = userEvent.setup();

      mockUpdateOrderStatus.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_PLACED,
        isLoading: false,
        isError: false,
      });

      renderOrderDetailsPage('/orders/WT-10005');

      await user.click(screen.getByRole('button', { name: /Cancel order/i }));
      await user.click(screen.getByRole('button', { name: /Yes, cancel order/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Failed to cancel order/i);
      });
    });
  });

  describe('Arabic Localization & RTL', () => {
    it('renders order details, statuses, and payment in Arabic when language is ar', async () => {
      useGetOrderQuery.mockReturnValue({
        data: MOCK_ORDER_DELIVERED,
        isLoading: false,
        isError: false,
      });

      await act(async () => {
        await i18n.changeLanguage('ar');
      });

      renderOrderDetailsPage('/orders/WT-10001');

      expect(
        screen.getByRole('heading', { level: 1, name: /طلب رقم #WT-10001/i }),
      ).toBeInTheDocument();
      expect(screen.getAllByText('تم التوصيل').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByTestId('payment-method-value')).toHaveTextContent('الدفع عند الاستلام');
      expect(screen.getByText(/عنوان التوصيل/i)).toBeInTheDocument();
      expect(screen.getByText(/ملخص الحساب/i)).toBeInTheDocument();

      await act(async () => {
        await i18n.changeLanguage('en');
      });
    });
  });
});
