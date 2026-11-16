import { createSlice } from '@reduxjs/toolkit';

// Item shape: see model/cartTotals.js. Reducers (add, setQuantity, remove, clear, applyPromo) are the cart owner's task.
const initialState = { items: [], promoCode: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
});

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
