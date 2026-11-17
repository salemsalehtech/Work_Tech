import { createSlice } from '@reduxjs/toolkit';

// items: product ids, at most MAX_COMPARE_ITEMS. Reducers are the compare owner's task.
const initialState = { items: [] };

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {},
});

export const selectCompareIds = (state) => state.compare.items;
export const selectCompareCount = (state) => state.compare.items.length;

export default compareSlice.reducer;
