import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer, DEMO_USER, getStoredSession } from '@features/auth';
import i18n from '@services/i18n';
import { PATHS } from '@shared/constants';

import Account from './index';

function renderAccountPage(initialAuthState = {}) {
  const preloadedAuth = {
    user: {
      ...DEMO_USER,
      notifications: {
        orderUpdates: true,
        promotions: false,
        priceDrops: true,
        newsletter: false,
      },
      ...initialAuthState.user,
    },
    accounts: initialAuthState.accounts || [],
    error: null,
  };

  return renderWithProviders(
    <Routes>
      <Route path={PATHS.ACCOUNT} element={<Account />} />
      <Route path={PATHS.HOME} element={<h1>Home Page</h1>} />
      <Route path={PATHS.ORDERS} element={<h1>Orders Page</h1>} />
      <Route path={PATHS.WISHLIST} element={<h1>Wishlist Page</h1>} />
    </Routes>,
    {
      reducer: { auth: authReducer },
      preloadedState: { auth: preloadedAuth },
      route: PATHS.ACCOUNT,
    },
  );
}

describe('Account Page (AB-04)', () => {
  describe('Personal Information Section', () => {
    it('displays the current authenticated user information', () => {
      renderAccountPage();

      expect(screen.getByRole('heading', { name: /Personal Information/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('Marwan Tarek');
      expect(screen.getByLabelText(/Mobile Number/i)).toHaveValue('01022334455');
      expect(screen.getByLabelText(/Email Address/i)).toHaveValue('marwan@worktech.com');
      expect(screen.getByLabelText(/Email Address/i)).toBeDisabled();
    });

    it('rejects invalid Egyptian phone number', async () => {
      const user = userEvent.setup();
      renderAccountPage();

      const phoneInput = screen.getByLabelText(/Mobile Number/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, '12345');

      await user.click(screen.getByRole('button', { name: /Save Changes/i }));

      expect(
        await screen.findByText(/Please enter a valid Egyptian mobile number/i),
      ).toBeInTheDocument();
    });

    it('successfully updates personal information and persists to storage', async () => {
      const user = userEvent.setup();
      const { store } = renderAccountPage();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/Mobile Number/i);

      await user.clear(nameInput);
      await user.type(nameInput, 'Ahmed Khaled');

      await user.clear(phoneInput);
      await user.type(phoneInput, '01123456789');

      await user.click(screen.getByRole('button', { name: /Save Changes/i }));

      expect(
        await screen.findByText(/Your personal information has been updated successfully/i),
      ).toBeInTheDocument();

      const stateUser = store.getState().auth.user;
      expect(stateUser.fullName).toBe('Ahmed Khaled');
      expect(stateUser.phone).toBe('01123456789');

      // Persistence check: user data saved to browser session
      const stored = getStoredSession();
      expect(stored.fullName).toBe('Ahmed Khaled');
      expect(stored.phone).toBe('01123456789');
    });
  });

  describe('Addresses Management Section', () => {
    it('displays saved addresses with details and default badge', () => {
      renderAccountPage();

      expect(screen.getByRole('heading', { name: /Saved Addresses/i })).toBeInTheDocument();
      expect(screen.getByText('16 El Tayaran St', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('shows empty state when user has no addresses', () => {
      renderAccountPage({ user: { addresses: [] } });

      expect(screen.getByText(/No saved addresses/i)).toBeInTheDocument();
      expect(screen.getByText(/You have not saved any addresses yet/i)).toBeInTheDocument();
    });

    it('validates, adds a new address, and persists to storage', async () => {
      const user = userEvent.setup();
      const { store, container } = renderAccountPage({ user: { addresses: [] } });

      // Click add new address from empty state
      await user.click(screen.getByRole('button', { name: /Add New Address/i }));

      // Try submitting empty
      await user.click(screen.getByRole('button', { name: /Save Address/i }));
      expect(await screen.findByText(/Recipient name is required/i)).toBeInTheDocument();

      // Fill valid address details
      await user.type(screen.getByLabelText(/Recipient Name/i), 'Mohamed Ali');
      const addressPhoneInput = container.querySelector('#address-phone');
      await user.type(addressPhoneInput, '01234567890');
      await user.type(screen.getByLabelText(/City/i), 'Giza');
      await user.type(screen.getByLabelText(/Street Address/i), '25 Dokki Street, Apt 4');

      await user.click(screen.getByRole('button', { name: /Save Address/i }));

      expect(await screen.findByText(/New address added successfully/i)).toBeInTheDocument();
      expect(screen.getByText('Mohamed Ali')).toBeInTheDocument();
      expect(screen.getByText(/25 Dokki Street/i)).toBeInTheDocument();

      const userAddresses = store.getState().auth.user.addresses;
      expect(userAddresses).toHaveLength(1);
      expect(userAddresses[0].fullName).toBe('Mohamed Ali');

      // Persistence check
      const stored = getStoredSession();
      expect(stored.addresses).toHaveLength(1);
      expect(stored.addresses[0].fullName).toBe('Mohamed Ali');
    });

    it('deletes an address and displays feedback', async () => {
      const user = userEvent.setup();
      const { store } = renderAccountPage();

      expect(screen.getByText('16 El Tayaran St', { exact: false })).toBeInTheDocument();

      const deleteBtn = screen.getByRole('button', { name: /Delete Marwan Tarek/i });
      await user.click(deleteBtn);

      expect(await screen.findByText(/Address deleted successfully/i)).toBeInTheDocument();
      expect(store.getState().auth.user.addresses).toHaveLength(0);
      expect(screen.getByText(/No saved addresses/i)).toBeInTheDocument();

      // Persistence check
      const stored = getStoredSession();
      expect(stored.addresses).toHaveLength(0);
    });
  });

  describe('Notification Preferences Section', () => {
    it('displays notification categories and interactive toggle switches', () => {
      renderAccountPage();

      expect(
        screen.getByRole('heading', { name: /Notification Preferences/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Order status updates/i })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Exclusive offers & promotions/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Price drop alerts/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Weekly tech digest/i })).toBeInTheDocument();

      const orderToggle = screen.getByRole('switch', { name: /Order status updates/i });
      expect(orderToggle).toBeChecked();

      const promoToggle = screen.getByRole('switch', { name: /Exclusive offers & promotions/i });
      expect(promoToggle).not.toBeChecked();
    });

    it('toggles notification preference and saves state in Redux and storage', async () => {
      const user = userEvent.setup();
      const { store } = renderAccountPage();

      const promoToggle = screen.getByRole('switch', { name: /Exclusive offers & promotions/i });
      await user.click(promoToggle);

      expect(await screen.findByText(/Preferences updated successfully/i)).toBeInTheDocument();
      expect(store.getState().auth.user.notifications.promotions).toBe(true);

      // Persistence check
      const stored = getStoredSession();
      expect(stored.notifications.promotions).toBe(true);
    });
  });

  describe('Sign Out and Session Management', () => {
    it('signs out the user and navigates to the Home page', async () => {
      const user = userEvent.setup();
      const { store } = renderAccountPage();

      const logoutBtn = screen.getByTestId('logout-button');
      await user.click(logoutBtn);

      expect(store.getState().auth.user).toBeNull();
      expect(await screen.findByText('Home Page')).toBeInTheDocument();
    });
  });

  describe('Arabic Localization & RTL', () => {
    it('renders the account page in Arabic when language is ar', async () => {
      await act(async () => {
        await i18n.changeLanguage('ar');
      });

      renderAccountPage();

      expect(screen.getByRole('heading', { name: 'حسابي' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'البيانات الشخصية' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'العناوين المحفوظة' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'تفضيلات الإشعارات' })).toBeInTheDocument();
      expect(screen.getByText('تسجيل الخروج')).toBeInTheDocument();

      // Reset language back to en
      await act(async () => {
        await i18n.changeLanguage('en');
      });
    });
  });
});
