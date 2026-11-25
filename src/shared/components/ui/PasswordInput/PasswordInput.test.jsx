import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PasswordInput from '.';

it('shows and hides the password', async () => {
  render(<PasswordInput id="password" label="Password" />);
  const field = screen.getByLabelText('Password');
  expect(field).toHaveAttribute('type', 'password');

  await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(field).toHaveAttribute('type', 'text');

  await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
  expect(field).toHaveAttribute('type', 'password');
});
