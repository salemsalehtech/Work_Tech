import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import Tabs from '.';

const items = [
  { id: 'specs', label: 'Specifications' },
  { id: 'box', label: 'In the box' },
  { id: 'ports', label: 'Ports' },
];

function Example() {
  const [value, setValue] = useState('specs');
  return (
    <Tabs label="Details" items={items} value={value} onChange={setValue}>
      {value} panel
    </Tabs>
  );
}

afterEach(() => {
  document.documentElement.dir = 'ltr';
});

it('shows the panel of the clicked tab', async () => {
  render(<Example />);

  await userEvent.click(screen.getByRole('tab', { name: 'In the box' }));

  expect(screen.getByRole('tabpanel', { name: 'In the box' })).toHaveTextContent('box panel');
});

it('moves with the arrows, wraps around, and jumps to the end', async () => {
  render(<Example />);
  await userEvent.click(screen.getByRole('tab', { name: 'Specifications' }));

  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'In the box' })).toHaveFocus();

  await userEvent.keyboard('{End}{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Specifications' })).toHaveFocus();
});

it('mirrors the arrows in Arabic', async () => {
  document.documentElement.dir = 'rtl';
  render(<Example />);
  await userEvent.click(screen.getByRole('tab', { name: 'Specifications' }));

  await userEvent.keyboard('{ArrowLeft}');

  expect(screen.getByRole('tab', { name: 'In the box' })).toHaveAttribute('aria-selected', 'true');
});
