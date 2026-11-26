import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InstallmentPicker from '.';

it('shows the monthly amount of each plan and reports the chosen months', async () => {
  const onChange = vi.fn();
  render(<InstallmentPicker price={48000} value={24} onChange={onChange} />);

  expect(screen.getByRole('button', { name: /^24/, pressed: true })).toHaveTextContent('2,000 EGP');
  await userEvent.click(screen.getByRole('button', { name: /^12/ }));

  expect(onChange).toHaveBeenCalledWith(12);
});
