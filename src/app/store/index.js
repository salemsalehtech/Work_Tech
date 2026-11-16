import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@features/auth';
import { cartReducer } from '@features/cart';
import { compareReducer } from '@features/compare';
import { wishlistReducer } from '@features/wishlist';
import { baseApi } from '@services/api';

import { loadPersistedState, persistStore } from './persistence';

const sliceReducers = {
  cart: cartReducer,
  wishlist: wishlistReducer,
  compare: compareReducer,
  auth: authReducer,
};

export const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer, ...sliceReducers },
  preloadedState: loadPersistedState(sliceReducers),
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

persistStore(store);
