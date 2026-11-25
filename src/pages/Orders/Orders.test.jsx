import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer, DEMO_USER } from '@features/auth';
import { useGetOrdersQuery } from '@features/orders';
import i18n from '@services/i18n';
import { PATHS } from '@shared/constants';

import Orders from './index';

vi.mock('@features/orders', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGetOrdersQuery: vi.fn(),
  };
});

const MOCK_ORDERS = [
  {
    id: 'WT-10001',
    userId: 'demo-user-1',
    createdAt: '2026-10-14T10:20:00Z',
    status: 'delivered',
    items: [{ productId: 'laptop-1', name: 'Lenovo LOQ', quantity: 1, price: 66999 }],
    totals: { total: 66999 },
  },
  {
    id: 'WT-10002',
    userId: 'demo-user-1',
    createdAt: '2026-10-15T10:20:00Z',
    status: 'delivered',
    items: [{ productId: 'laptop-2', name: 'Dell XPS 15', quantity: 1, price: 87279 }],
    totals: { total: 87279 },
  },
  {
    id: 'WT-10003',
    userId: 'demo-user-1',
    createdAt: '2026-10-27T13:20:00Z',
    status: 'shipped',
    items: [{ productId: 'laptop-3', name: 'HP Spectre', quantity: 1, price: 50999 }],
    totals: { total: 50999 },
  },
  {
    id: 'WT-10004',
    userId: 'demo-user-1',
    createdAt: '2026-11-06T16:20:00Z',
    status: 'processing',
    items: [{ productId: 'laptop-4', name: 'Asus Zenbook', quantity: 1, price: 41999 }],
    totals: { total: 41999 },
  },
  {
    id: 'WT-10005',
    userId: 'demo-user-1',
    createdAt: '2026-11-08T16:20:00Z',
    status: 'placed',
    items: [{ productId: 'laptop-5', name: 'MacBook Pro', quantity: 1, price: 85323 }],
    totals: { total: 85323 },
  },
  {
    id: 'WT-10006',
    userId: 'demo-user-1',
    createdAt: '2026-11-14T19:50:00Z',
    status: 'cancelled',
    items: [{ productId: 'laptop-6', name: 'Acer Swift', quantity: 1, price: 31168 }],
    totals: { total: 31168 },
  },
  {
    id: 'WT-10007',
    userId: 'demo-user-1',
    createdAt: '2026-11-10T12:05:00Z',
    status: 'delivered',
    items: [{ productId: 'laptop-7', name: 'Lenovo IdeaPad', quantity: 1, price: 2040 }],
    totals: { total: 2040 },
  },
];

function renderOrdersPage(initialRoute = PATHS.ORDERS, customUser = DEMO_USER) {
  return renderWithProviders(
    <Routes>
      <Route path={PATHS.ORDERS} element={<Orders />} />
      <Route path={PATHS.HOME} element={<h1>Home Page</h1>} />
      <Route path="/orders/:id" element={<h1>Order Details Page</h1>} />
    </Routes>,
    {
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: customUser,
          accounts: [],
          error: null,
        },
      },
      route: initialRoute,
    },
  );
}

describe('My Orders Page (AB-05)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Requirement 1: Fetching current user orders', () => {
    it('passes the actual authenticated user ID to useGetOrdersQuery', () => {
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage(PATHS.ORDERS, { ...DEMO_USER, id: 'custom-user-999' });

      expect(useGetOrdersQuery).toHaveBeenCalledWith('custom-user-999', { skip: false });
    });
  });

  describe('Requirement 6: DataState 4 states', () => {
    it('renders loading skeleton when query is loading', () => {
      useGetOrdersQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      renderOrdersPage();

      expect(screen.getByLabelText(/Loading orders/i)).toBeInTheDocument();
    });

    it('renders error state with retry button when query fails', () => {
      const mockRefetch = vi.fn();
      useGetOrdersQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: mockRefetch,
      });

      renderOrdersPage();

      expect(
        screen.getByRole('heading', { level: 2, name: /We could not load this/i }),
      ).toBeInTheDocument();
      const retryBtn = screen.getByRole('button', { name: /Try again/i });
      expect(retryBtn).toBeInTheDocument();
    });

    it('renders EmptyState when user has no orders in the database', () => {
      useGetOrdersQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      renderOrdersPage();

      expect(screen.getByRole('heading', { level: 2, name: /No orders yet/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Browse Laptops/i })).toHaveAttribute(
        'href',
        PATHS.PRODUCTS,
      );
    });

    it('renders no matching results state when filter produces 0 results', async () => {
      const user = userEvent.setup();
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage();

      const searchInput = screen.getByLabelText(/Search by order number/i);
      await user.type(searchInput, 'NON-EXISTENT-ORDER-ID');

      expect(
        screen.getByRole('heading', { level: 2, name: /No matching orders found/i }),
      ).toBeInTheDocument();
      const clearBtn = screen.getByRole('button', { name: /Clear Filters/i });
      expect(clearBtn).toBeInTheDocument();

      await user.click(clearBtn);
      expect(screen.getByText('WT-10001')).toBeInTheDocument();
    });
  });

  describe('Requirement 2 & 7: Display orders and newest-to-oldest sorting for demo-user-1', () => {
    it('displays all 7 orders sorted from newest to oldest', () => {
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage();

      const orderCards = screen.getAllByTestId(/^order-card-/);
      expect(orderCards).toHaveLength(7);

      // Verify exact newest-to-oldest order
      expect(orderCards[0]).toHaveTextContent('WT-10006'); // 2026-11-14
      expect(orderCards[1]).toHaveTextContent('WT-10007'); // 2026-11-10
      expect(orderCards[2]).toHaveTextContent('WT-10005'); // 2026-11-08
      expect(orderCards[3]).toHaveTextContent('WT-10004'); // 2026-11-06
      expect(orderCards[4]).toHaveTextContent('WT-10003'); // 2026-10-27
      expect(orderCards[5]).toHaveTextContent('WT-10002'); // 2026-10-15
      expect(orderCards[6]).toHaveTextContent('WT-10001'); // 2026-10-14
    });

    it('displays order number, date, status badge, total price, and details link', () => {
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage();

      const card1 = screen.getByTestId('order-card-WT-10001');
      expect(card1).toHaveTextContent('WT-10001');
      expect(card1).toHaveTextContent('Delivered');
      expect(card1).toHaveTextContent('66,999 EGP');

      const detailsLink = within(card1).getByRole('link', { name: /View order details/i });
      expect(detailsLink).toHaveAttribute('href', '/orders/WT-10001');
    });
  });

  describe('Requirement 3 & 4: Filtering and search with URL synchronization', () => {
    it('filters by status and reflects in the URL', async () => {
      const user = userEvent.setup();
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage();

      const select = screen.getByLabelText(/Filter by status/i);
      await user.selectOptions(select, 'delivered');

      const visibleCards = screen.getAllByTestId(/^order-card-/);
      expect(visibleCards).toHaveLength(3);
      expect(screen.getByTestId('order-card-WT-10001')).toBeInTheDocument();
      expect(screen.getByTestId('order-card-WT-10002')).toBeInTheDocument();
      expect(screen.getByTestId('order-card-WT-10007')).toBeInTheDocument();
      expect(screen.queryByTestId('order-card-WT-10003')).not.toBeInTheDocument();
    });

    it('searches by order number and updates URL query', async () => {
      const user = userEvent.setup();
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage();

      const searchInput = screen.getByLabelText(/Search by order number/i);
      await user.type(searchInput, 'WT-10003');

      const visibleCards = screen.getAllByTestId(/^order-card-/);
      expect(visibleCards).toHaveLength(1);
      expect(screen.getByTestId('order-card-WT-10003')).toBeInTheDocument();
    });

    it('combines status filter and search query simultaneously', async () => {
      const user = userEvent.setup();
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage();

      const select = screen.getByLabelText(/Filter by status/i);
      await user.selectOptions(select, 'delivered');

      const searchInput = screen.getByLabelText(/Search by order number/i);
      await user.type(searchInput, 'WT-10007');

      const visibleCards = screen.getAllByTestId(/^order-card-/);
      expect(visibleCards).toHaveLength(1);
      expect(screen.getByTestId('order-card-WT-10007')).toBeInTheDocument();
    });

    it('initializes search and status controls from direct URL parameters', () => {
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage('/orders?status=shipped&q=WT-10003');

      expect(screen.getByLabelText(/Filter by status/i)).toHaveValue('shipped');
      expect(screen.getByLabelText(/Search by order number/i)).toHaveValue('WT-10003');

      const visibleCards = screen.getAllByTestId(/^order-card-/);
      expect(visibleCards).toHaveLength(1);
      expect(screen.getByTestId('order-card-WT-10003')).toBeInTheDocument();
    });

    it('resets all filters when clicking Reset all filters', async () => {
      const user = userEvent.setup();
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      renderOrdersPage('/orders?status=processing&q=10004');

      expect(screen.getAllByTestId(/^order-card-/)).toHaveLength(1);

      const resetBtn = screen.getByRole('button', { name: /Reset all filters/i });
      await user.click(resetBtn);

      expect(screen.getAllByTestId(/^order-card-/)).toHaveLength(7);
      expect(screen.getByLabelText(/Filter by status/i)).toHaveValue('all');
      expect(screen.getByLabelText(/Search by order number/i)).toHaveValue('');
    });
  });

  describe('Arabic Localization & RTL', () => {
    it('renders the page and status labels in Arabic when language is ar', async () => {
      useGetOrdersQuery.mockReturnValue({
        data: MOCK_ORDERS,
        isLoading: false,
        isError: false,
      });

      await act(async () => {
        await i18n.changeLanguage('ar');
      });

      renderOrdersPage();

      expect(screen.getByRole('heading', { level: 1, name: 'طلباتي' })).toBeInTheDocument();
      expect(screen.getAllByText('تم التوصيل').length).toBeGreaterThanOrEqual(1); // delivered in Arabic
      expect(screen.getAllByText('مع المندوب').length).toBeGreaterThanOrEqual(1); // shipped in Arabic
      expect(screen.getAllByText('تم التجهيز').length).toBeGreaterThanOrEqual(1); // processing in Arabic
      expect(screen.getAllByText('تم الطلب').length).toBeGreaterThanOrEqual(1); // placed in Arabic
      expect(screen.getAllByText('ملغي').length).toBeGreaterThanOrEqual(1); // cancelled in Arabic

      await act(async () => {
        await i18n.changeLanguage('en');
      });
    });
  });
});
