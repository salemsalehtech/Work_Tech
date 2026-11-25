import { createSlice } from '@reduxjs/toolkit';

// Item shape: { productId, savedPrice, savedAt, priceAlert }. priceAlert is on or off.
const initialState = { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: {
      prepare: ({ productId, price }) => ({
        payload: { productId, price, savedAt: new Date().toISOString() },
      }),
      reducer(state, { payload: { productId, price, savedAt } }) {
        const others = state.items.filter((item) => item.productId !== productId);
        if (others.length < state.items.length) state.items = others;
        else state.items.push({ productId, savedPrice: price, savedAt, priceAlert: false });
      },
    },
    removeFromWishlist(state, { payload: productId }) {
      state.items = state.items.filter((item) => item.productId !== productId);
    },
    setPriceAlert(state, { payload: { productId, enabled } }) {
      const item = state.items.find((saved) => saved.productId === productId);
      if (item) item.priceAlert = enabled;
    },
  },
});

export const { toggleWishlist, removeFromWishlist, setPriceAlert } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;

export default wishlistSlice.reducer;
