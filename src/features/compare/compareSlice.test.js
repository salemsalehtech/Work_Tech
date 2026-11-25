import reducer, { clearCompare, removeFromCompare, toggleCompare } from './compareSlice';

const toggle = (...ids) => ids.reduce((state, id) => reducer(state, toggleCompare(id)), undefined);

it('adds a laptop, then removes it on the second toggle', () => {
  expect(toggle('a', 'b').items).toEqual(['a', 'b']);
  expect(toggle('a', 'b', 'a').items).toEqual(['b']);
});

it('holds at most three laptops', () => {
  expect(toggle('a', 'b', 'c', 'd').items).toEqual(['a', 'b', 'c']);
});

it('removes one laptop and clears the list', () => {
  const state = toggle('a', 'b');

  expect(reducer(state, removeFromCompare('a')).items).toEqual(['b']);
  expect(reducer(state, clearCompare()).items).toEqual([]);
});
