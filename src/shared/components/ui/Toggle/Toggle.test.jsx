import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toggle from '.';

it('is a named switch that reports its next state', async () => {
  const onChange = vi.fn();
  render(<Toggle id="stock" label="In stock only" checked={false} onChange={onChange} />);

  await userEvent.click(screen.getByRole('switch', { name: 'In stock only' }));

  expect(onChange).toHaveBeenCalledWith(true);
});
