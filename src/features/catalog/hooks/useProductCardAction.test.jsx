import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { cartReducer, selectCartCount } from '@features/cart';
import { compareReducer, selectCompareIds } from '@features/compare';
import { wishlistReducer } from '@features/wishlist';

import { useProductCardActions } from './useProductCardActions';

const sampleProduct = {
  id: 'laptop-1',
  brand: 'ASUS',
  name: 'ROG Strix G16',
  price: 45990,
  oldPrice: null,
  images: ['/img/rog.png'],
  stock: 5,
  specs: {
    cpu: 'Intel Core i7-13650HX',
    ram: 16,
    storage: 1024,
    gpu: 'NVIDIA GeForce RTX 4060',
  },
};

function createWrapper(preloadedState) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      compare: compareReducer,
      wishlist: wishlistReducer,
    },
    preloadedState,
  });

  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, Wrapper };
}

describe('useProductCardActions', () => {
  it('returns false for inWishlist and inCompare initially, and true when present in store', () => {
    const { Wrapper: emptyWrapper } = createWrapper();
    const { result: emptyResult } = renderHook(() => useProductCardActions(), {
      wrapper: emptyWrapper,
    });

    expect(emptyResult.current(sampleProduct)).toMatchObject({
      inWishlist: false,
      inCompare: false,
    });

    const { Wrapper: activeWrapper } = createWrapper({
      wishlist: { items: [{ productId: 'laptop-1', savedPrice: 45990 }] },
      compare: { items: ['laptop-1'] },
    });
    const { result: activeResult } = renderHook(() => useProductCardActions(), {
      wrapper: activeWrapper,
    });

    expect(activeResult.current(sampleProduct)).toMatchObject({
      inWishlist: true,
      inCompare: true,
    });
  });

  it('adds the product to the cart store on onAddToCart', () => {
    const { store, Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductCardActions(), { wrapper: Wrapper });

    act(() => {
      result.current(sampleProduct).onAddToCart();
    });

    expect(selectCartCount(store.getState())).toBe(1);
  });

  it('toggles the product id in the compare store on onToggleCompare', () => {
    const { store, Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductCardActions(), { wrapper: Wrapper });

    act(() => {
      result.current(sampleProduct).onToggleCompare();
    });
    expect(selectCompareIds(store.getState())).toEqual(['laptop-1']);

    act(() => {
      result.current(sampleProduct).onToggleCompare();
    });
    expect(selectCompareIds(store.getState())).toEqual([]);
  });
});
