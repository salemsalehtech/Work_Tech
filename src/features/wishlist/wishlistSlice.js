import { createSlice } from '@reduxjs/toolkit';

// Item shape: { productId, savedPrice, savedAt, priceAlert }. Reducers are the wishlist owner's task.
const initialState = { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
});

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;

export default wishlistSlice.reducer;
