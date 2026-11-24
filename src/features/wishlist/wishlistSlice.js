import { createSlice } from '@reduxjs/toolkit';

// Item shape: { productId, savedPrice, savedAt, priceAlert, targetPrice }
const initialState = { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const payload = action.payload;
      if (!payload) return;

      const productId = typeof payload === 'object' ? payload.productId : payload;
      if (!productId || typeof productId !== 'string') return;

      const trimmedId = productId.trim();
      if (!trimmedId) return;

      const existingIndex = state.items.findIndex((item) => item.productId === trimmedId);

      if (existingIndex !== -1) {
        state.items.splice(existingIndex, 1);
      } else {
        const rawPrice =
          typeof payload === 'object' ? (payload.price ?? payload.savedPrice) : undefined;
        const validPrice =
          typeof rawPrice === 'number' && !isNaN(rawPrice) && rawPrice >= 0 ? rawPrice : 0;
        const savedAt =
          typeof payload === 'object' && payload.savedAt
            ? payload.savedAt
            : new Date().toISOString();

        state.items.push({
          productId: trimmedId,
          savedPrice: validPrice,
          savedAt,
          priceAlert: null,
          targetPrice: null,
        });
      }
    },

    setPriceAlert: (state, action) => {
      const payload = action.payload;
      if (!payload || typeof payload !== 'object') return;

      const productId = payload.productId;
      if (!productId || typeof productId !== 'string') return;

      const trimmedId = productId.trim();
      const rawPrice = payload.targetPrice ?? payload.priceAlert ?? payload.price;

      if (typeof rawPrice !== 'number' || isNaN(rawPrice) || rawPrice <= 0) {
        return;
      }

      const item = state.items.find((item) => item.productId === trimmedId);
      if (!item) {
        return;
      }

      item.priceAlert = rawPrice;
      item.targetPrice = rawPrice;
    },

    removeFromWishlist: (state, action) => {
      const payload = action.payload;
      if (!payload) return;

      const productId = typeof payload === 'object' ? payload.productId : payload;
      if (!productId || typeof productId !== 'string') return;

      const trimmedId = productId.trim();
      state.items = state.items.filter((item) => item.productId !== trimmedId);
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { toggleWishlist, setPriceAlert, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectWishlistIds = (state) => state.wishlist.items.map((item) => item.productId);
export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items.some((item) => item.productId === productId);
export const selectWishlistItemById = (state, productId) =>
  state.wishlist.items.find((item) => item.productId === productId) || null;

export default wishlistSlice.reducer;
