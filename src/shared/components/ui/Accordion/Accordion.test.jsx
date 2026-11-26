import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Accordion from '.';

const items = [
  { id: 'shipping', title: 'How long is delivery?', content: 'One to three days.' },
  { id: 'returns', title: 'Can I return it?', content: 'Within 14 days.' },
];

it('opens one answer at a time', async () => {
  render(<Accordion items={items} defaultOpenIds={['shipping']} />);
  expect(screen.getByText('One to three days.')).toBeVisible();

  await userEvent.click(screen.getByRole('button', { name: 'Can I return it?' }));

  expect(screen.getByText('Within 14 days.')).toBeVisible();
  expect(screen.getByText('One to three days.')).not.toBeVisible();
});
