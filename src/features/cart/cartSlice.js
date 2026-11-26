import { createSlice } from '@reduxjs/toolkit';

import { quantityLimit } from './model/cartItem';
import { cartItemKey } from './model/cartTotals';

// Item shape: see model/cartTotals.js. Build items with toCartItem.
const initialState = { items: [], promoCode: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, { payload }) {
      const key = cartItemKey(payload.productId, payload.options);
      const line = state.items.find((item) => item.key === key);
      const quantity = (line?.quantity ?? 0) + (payload.quantity ?? 1);

      if (line) line.quantity = Math.min(quantity, quantityLimit(line.stock));
      else
        state.items.push({
          ...payload,
          key,
          quantity: Math.min(quantity, quantityLimit(payload.stock)),
        });
    },
    setQuantity(state, { payload: { key, quantity } }) {
      const line = state.items.find((item) => item.key === key);
      if (line) line.quantity = Math.min(Math.max(1, quantity), quantityLimit(line.stock));
    },
    removeItem(state, { payload: key }) {
      state.items = state.items.filter((item) => item.key !== key);
    },
    clearCart() {
      return initialState;
    },
    applyPromo(state, { payload: code }) {
      state.promoCode = code;
    },
    removePromo(state) {
      state.promoCode = null;
    },
  },
});

export const { addItem, setQuantity, removeItem, clearCart, applyPromo, removePromo } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectPromoCode = (state) => state.cart.promoCode;

export default cartSlice.reducer;
