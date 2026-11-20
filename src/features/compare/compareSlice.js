import { createSlice } from '@reduxjs/toolkit';

import { MAX_COMPARE_ITEMS } from '@shared/constants';

const initialState = { items: [] };

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const productId = action.payload;

      if (state.items.includes(productId) || state.items.length >= MAX_COMPARE_ITEMS) {
        return;
      }

      state.items.push(productId);
    },

    removeFromCompare: (state, action) => {
      state.items = state.items.filter((id) => id !== action.payload);
    },

    toggleCompare: (state, action) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);

      if (index !== -1) {
        state.items.splice(index, 1);
      } else if (state.items.length < MAX_COMPARE_ITEMS) {
        state.items.push(productId);
      }
    },

    clearCompare: (state) => {
      state.items = [];
    },
  },
});

export const { addToCompare, removeFromCompare, toggleCompare, clearCompare } =
  compareSlice.actions;

export const selectCompareIds = (state) => state.compare.items;
export const selectCompareCount = (state) => state.compare.items.length;

export default compareSlice.reducer;
