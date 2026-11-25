import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ChoiceList from '.';

const options = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'study', label: 'Study', description: 'Notes and browsing' },
];

it('reports the chosen radio', async () => {
  const onChange = vi.fn();
  render(<ChoiceList legend="Use" options={options} value="gaming" onChange={onChange} />);

  expect(screen.getByRole('group', { name: 'Use' })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('radio', { name: /Study/ }));

  expect(onChange).toHaveBeenCalledWith('study');
});

it('adds and removes values when multiple', async () => {
  const onChange = vi.fn();
  render(
    <ChoiceList legend="Use" options={options} value={['gaming']} onChange={onChange} multiple />,
  );

  await userEvent.click(screen.getByRole('checkbox', { name: /Study/ }));
  await userEvent.click(screen.getByRole('checkbox', { name: 'Gaming' }));

  expect(onChange).toHaveBeenNthCalledWith(1, ['gaming', 'study']);
  expect(onChange).toHaveBeenNthCalledWith(2, []);
});
