import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DataState from '.';

const view = (result) =>
  render(
    <DataState result={result} loading={<p>loading</p>} empty={<p>empty</p>}>
      {(items) => <p>{items.length} items</p>}
    </DataState>,
  );

it('shows the loading state first', () => {
  view({ isLoading: true });
  expect(screen.getByText('loading')).toBeInTheDocument();
});

it('shows the empty state for an empty list', () => {
  view({ data: [] });
  expect(screen.getByText('empty')).toBeInTheDocument();
});

it('shows the data', () => {
  view({ data: [1, 2] });
  expect(screen.getByText('2 items')).toBeInTheDocument();
});

it('shows the error with a retry that refetches', async () => {
  const refetch = vi.fn();
  view({ isError: true, refetch });

  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(refetch).toHaveBeenCalledOnce();
});
