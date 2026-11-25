import { render, screen } from '@testing-library/react';

import OrderTracker from '.';

const steps = [
  { status: 'Done', title: 'Placed' },
  { status: 'In progress', title: 'Packed' },
  { status: 'Next', title: 'With courier' },
  { status: 'Next', title: 'Delivered' },
];

it('marks the current step', () => {
  render(<OrderTracker steps={steps} current={1} />);

  expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Packed');
});

it('has no current step once delivered', () => {
  render(<OrderTracker steps={steps} current={3} complete />);

  expect(screen.queryByRole('listitem', { current: 'step' })).not.toBeInTheDocument();
});

it('renders nothing for a cancelled order', () => {
  render(<OrderTracker steps={steps} current={-1} />);

  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
