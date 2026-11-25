import { createSlice } from '@reduxjs/toolkit';

import { MAX_COMPARE_ITEMS } from '@shared/constants';

// items: product ids, at most MAX_COMPARE_ITEMS.
const initialState = { items: [] };

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare(state, { payload: id }) {
      if (state.items.includes(id)) state.items = state.items.filter((item) => item !== id);
      else if (state.items.length < MAX_COMPARE_ITEMS) state.items.push(id);
    },
    removeFromCompare(state, { payload: id }) {
      state.items = state.items.filter((item) => item !== id);
    },
    clearCompare(state) {
      state.items = [];
    },
  },
});

export const { toggleCompare, removeFromCompare, clearCompare } = compareSlice.actions;

export const selectCompareIds = (state) => state.compare.items;
export const selectCompareCount = (state) => state.compare.items.length;

export default compareSlice.reducer;
