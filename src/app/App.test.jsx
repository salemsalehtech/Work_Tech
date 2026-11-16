import { render, screen } from '@testing-library/react';

import App from './App';

it('renders the store frame and the home page', async () => {
  render(<App />);

  expect(screen.getByRole('link', { name: 'WorkTech' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: 'Cart, 0 items' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Skip to content' })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
  expect(screen.getByText(/DEPI graduation project/)).toBeInTheDocument();
});
