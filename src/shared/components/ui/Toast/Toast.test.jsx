import { act, fireEvent, render, screen } from '@testing-library/react';

import ToastProvider from './ToastProvider';
import { useToast } from './useToast';

function AddButton() {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast.show({ title: 'Added to cart' })}>
      Add
    </button>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

it('announces the message and hides it after the duration', () => {
  vi.useFakeTimers();
  render(
    <ToastProvider duration={4000}>
      <AddButton />
    </ToastProvider>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  expect(screen.getByRole('status')).toHaveTextContent('Added to cart');

  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});
