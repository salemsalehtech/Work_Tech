import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@features/auth';
import { cartReducer } from '@features/cart';
import { compareReducer } from '@features/compare';
import { wishlistReducer } from '@features/wishlist';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    auth: authReducer,
  },
});
