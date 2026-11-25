import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmButton from '.';

const click = (name) => userEvent.click(screen.getByRole('button', { name }));

it('acts only after the question is confirmed', async () => {
  const onConfirm = vi.fn();
  render(<ConfirmButton label="Remove" question="Remove it?" onConfirm={onConfirm} />);

  await click('Remove');
  expect(onConfirm).not.toHaveBeenCalled();
  expect(screen.getByRole('group', { name: 'Remove it?' })).toBeInTheDocument();

  await click('Remove');
  expect(onConfirm).toHaveBeenCalledOnce();
});

it('goes back without acting', async () => {
  const onConfirm = vi.fn();
  render(<ConfirmButton label="Remove" question="Remove it?" onConfirm={onConfirm} />);

  await click('Remove');
  await click('Keep it');

  expect(onConfirm).not.toHaveBeenCalled();
  expect(screen.queryByRole('group')).not.toBeInTheDocument();
});
