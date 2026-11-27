import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer, RequireAuth, selectCurrentUser } from '@features/auth';

import Account from '.';

function renderAccount() {
  const { store } = renderWithProviders(
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/auth" element={<h1>Sign in</h1>} />
      <Route element={<RequireAuth />}>
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>,
    {
      route: '/account',
      reducer: { auth: authReducer },
      preloadedState: { auth: { userId: 'demo-user-1', accounts: [] } },
    },
  );
  return { user: () => selectCurrentUser(store.getState()) };
}
const click = (name) => userEvent.click(screen.getByRole('button', { name }));

it('saves the account details', async () => {
  const { user } = renderAccount();
  const phone = screen.getByLabelText('Mobile number');

  await userEvent.clear(phone);
  await userEvent.type(phone, '01111111111');
  await click('Save changes');

  expect(user().phone).toBe('01111111111');
  expect(screen.getByText('Your details were saved.')).toBeInTheDocument();
});

it('does not save a wrong mobile number', async () => {
  const { user } = renderAccount();
  const phone = screen.getByLabelText('Mobile number');

  await userEvent.clear(phone);
  await userEvent.type(phone, '123');
  await click('Save changes');

  expect(phone).toHaveFocus();
  expect(user().phone).toBe('01022334455');
});

it('adds an address', async () => {
  const { user } = renderAccount();

  await click('+ Add an address');
  const form = within(screen.getByRole('button', { name: 'Save address' }).closest('form'));
  await userEvent.type(form.getByLabelText('Full name'), 'Mona Adel');
  await userEvent.type(form.getByLabelText('Mobile number'), '01012345678');
  await userEvent.type(form.getByLabelText('City'), 'Giza');
  await userEvent.type(form.getByLabelText('Address'), '25 Dokki Street, flat 4');
  await click('Save address');

  expect(user().addresses).toHaveLength(2);
  expect(screen.getByText('25 Dokki Street, flat 4')).toBeInTheDocument();
});

it('asks before it removes an address', async () => {
  const { user } = renderAccount();

  await click('Remove 16 El Tayaran St');
  expect(user().addresses).toHaveLength(1);
  await click('Remove');

  expect(user().addresses).toHaveLength(0);
});

it('keeps a notification choice', async () => {
  const { user } = renderAccount();

  await userEvent.click(screen.getByRole('switch', { name: 'Weekly newsletter' }));

  expect(user().notifications.newsletter).toBe(true);
});

it('goes home after signing out', async () => {
  const { user } = renderAccount();

  await click('Sign out');

  expect(user()).toBeNull();
  expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
});
