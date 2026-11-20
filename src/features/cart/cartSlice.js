import { createSlice } from '@reduxjs/toolkit';

import { MAX_QTY_PER_ITEM } from '@shared/constants';

import { cartItemKey } from './model/cartTotals';

const initialState = { items: [], promoCode: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const key = cartItemKey(item.productId, item.options);

      const existingItem = state.items.find((item) => item.key === key);

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + item.quantity,
          item.stock,
          MAX_QTY_PER_ITEM,
        );
      } else {
        state.items.push({
          ...item,
          key,
          quantity: Math.min(item.quantity, item.stock, MAX_QTY_PER_ITEM),
        });
      }
    },

    setQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const item = state.items.find((item) => item.key === key);

      if (item) {
        item.quantity = Math.min(Math.max(1, quantity), item.stock, MAX_QTY_PER_ITEM);
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.key !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
    },

    applyPromo: (state, action) => {
      state.promoCode = action.payload;
    },

    removePromo: (state) => {
      state.promoCode = null;
    },
  },
});

export const { addItem, setQuantity, removeItem, clearCart, applyPromo, removePromo } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
