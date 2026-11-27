import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '@shared/components/ui';

import { useForm } from '.';

const validate = ({ name, city }) => ({
  ...(name ? {} : { name: 'nameRequired' }),
  ...(city ? {} : { city: 'cityRequired' }),
});

function Example({ onSave }) {
  const form = useForm({ initialValues: { name: '', city: '' }, validate });
  return (
    <form onSubmit={form.handleSubmit(onSave)}>
      <Input id="name" label="Name" error={form.errorOf('name')} {...form.field('name')} />
      <Input id="city" label="City" error={form.errorOf('city')} {...form.field('city')} />
      <button type="submit">Save</button>
    </form>
  );
}

it('shows the error of a field once it is left', async () => {
  render(<Example />);
  expect(screen.queryByText('nameRequired')).not.toBeInTheDocument();

  await userEvent.click(screen.getByLabelText('Name'));
  await userEvent.tab();

  expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('nameRequired');
  expect(screen.queryByText('cityRequired')).not.toBeInTheDocument();
});

it('shows every error on submit and focuses the first wrong field', async () => {
  const onSave = vi.fn();
  render(<Example onSave={onSave} />);

  await userEvent.type(screen.getByLabelText('Name'), 'Mona');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));

  expect(screen.getByText('cityRequired')).toBeInTheDocument();
  expect(screen.getByLabelText('City')).toHaveFocus();
  expect(onSave).not.toHaveBeenCalled();
});

it('submits the values when they are valid', async () => {
  const onSave = vi.fn();
  render(<Example onSave={onSave} />);

  await userEvent.type(screen.getByLabelText('Name'), 'Mona');
  await userEvent.type(screen.getByLabelText('City'), 'Giza{Enter}');

  expect(onSave).toHaveBeenCalledWith({ name: 'Mona', city: 'Giza' });
});
