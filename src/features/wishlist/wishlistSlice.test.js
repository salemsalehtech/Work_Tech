import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import wishlistReducer, {
  clearWishlist,
  removeFromWishlist,
  selectIsInWishlist,
  selectIsPriceAlertEnabled,
  selectWishlistCount,
  selectWishlistItemById,
  selectWishlistIds,
  selectWishlistItems,
  setPriceAlert,
  setPriceAlertEnabled,
  togglePriceAlert,
  toggleWishlist,
} from './wishlistSlice';

describe('Wishlist Slice (AB-02)', () => {
  const initialState = { items: [] };

  describe('toggleWishlist', () => {
    it('adds a product to an empty wishlist', () => {
      const state = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-1', price: 42999 }),
      );

      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('laptop-1');
    });

    it('stores the correct productId', () => {
      const state = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-asus-zenbook', price: 42999 }),
      );

      expect(state.items[0].productId).toBe('laptop-asus-zenbook');
    });

    it('stores the correct savedPrice at the time of adding', () => {
      const state = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-1', price: 35500 }),
      );

      expect(state.items[0].savedPrice).toBe(35500);
    });

    it('supports savedPrice key in payload', () => {
      const state = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-1', savedPrice: 48000 }),
      );

      expect(state.items[0].savedPrice).toBe(48000);
    });

    it('stores a valid ISO savedAt timestamp', () => {
      const before = new Date().getTime();
      const state = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-1', price: 29999 }),
      );
      const after = new Date().getTime();

      const savedAt = state.items[0].savedAt;
      expect(savedAt).toBeDefined();
      const timestamp = new Date(savedAt).getTime();
      expect(Number.isNaN(timestamp)).toBe(false);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('removes an existing product by toggling it again', () => {
      const stateWithItem = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-1', price: 40000 }),
      );
      expect(stateWithItem.items).toHaveLength(1);

      const stateAfterToggle = wishlistReducer(
        stateWithItem,
        toggleWishlist({ productId: 'laptop-1', price: 40000 }),
      );
      expect(stateAfterToggle.items).toHaveLength(0);
    });

    it('prevents duplicate entries for the same product', () => {
      const state1 = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-1', price: 40000 }),
      );
      const state2 = wishlistReducer(
        state1,
        toggleWishlist({ productId: 'laptop-2', price: 50000 }),
      );
      expect(state2.items).toHaveLength(2);

      // Toggling laptop-1 removes it instead of creating duplicate
      const state3 = wishlistReducer(
        state2,
        toggleWishlist({ productId: 'laptop-1', price: 40000 }),
      );
      expect(state3.items).toHaveLength(1);
      expect(state3.items[0].productId).toBe('laptop-2');
    });

    it('handles missing or invalid payload values safely', () => {
      // Undefined payload
      expect(wishlistReducer(initialState, toggleWishlist()).items).toHaveLength(0);

      // Null payload
      expect(wishlistReducer(initialState, toggleWishlist(null)).items).toHaveLength(0);

      // Missing productId
      expect(wishlistReducer(initialState, toggleWishlist({ price: 20000 })).items).toHaveLength(0);

      // Empty string productId
      expect(
        wishlistReducer(initialState, toggleWishlist({ productId: '   ', price: 20000 })).items,
      ).toHaveLength(0);

      // Non-string productId
      expect(
        wishlistReducer(initialState, toggleWishlist({ productId: 12345, price: 20000 })).items,
      ).toHaveLength(0);

      // Missing or non-numeric price defaults to 0 safely
      const stateWithMissingPrice = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-no-price' }),
      );
      expect(stateWithMissingPrice.items).toHaveLength(1);
      expect(stateWithMissingPrice.items[0].savedPrice).toBe(0);

      const stateWithInvalidPrice = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-bad-price', price: 'invalid' }),
      );
      expect(stateWithInvalidPrice.items).toHaveLength(1);
      expect(stateWithInvalidPrice.items[0].savedPrice).toBe(0);
    });

    it('accepts string productId shorthand for toggle', () => {
      const state = wishlistReducer(initialState, toggleWishlist('laptop-shorthand'));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('laptop-shorthand');
      expect(state.items[0].savedPrice).toBe(0);

      const stateAfterUntoggle = wishlistReducer(state, toggleWishlist('laptop-shorthand'));
      expect(stateAfterUntoggle.items).toHaveLength(0);
    });
  });

  describe('setPriceAlert', () => {
    it('sets a price alert for an existing wishlist item', () => {
      const stateWithItem = wishlistReducer(
        initialState,
        toggleWishlist({ productId: 'laptop-1', price: 45000 }),
      );

      const stateWithAlert = wishlistReducer(
        stateWithItem,
        setPriceAlert({ productId: 'laptop-1', targetPrice: 40000 }),
      );

      expect(stateWithAlert.items[0].priceAlert).toBe(40000);
      expect(stateWithAlert.items[0].targetPrice).toBe(40000);
    });

    it('updates an existing price alert', () => {
      const stateWithAlert = wishlistReducer(
        {
          items: [
            {
              productId: 'laptop-1',
              savedPrice: 45000,
              savedAt: '2026-10-01T10:00:00.000Z',
              priceAlert: 42000,
              targetPrice: 42000,
            },
          ],
        },
        setPriceAlert({ productId: 'laptop-1', targetPrice: 38000 }),
      );

      expect(stateWithAlert.items[0].priceAlert).toBe(38000);
      expect(stateWithAlert.items[0].targetPrice).toBe(38000);
    });

    it('ensures other wishlist items remain unchanged when an alert is set', () => {
      const stateWithTwo = {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 45000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
          {
            productId: 'laptop-2',
            savedPrice: 60000,
            savedAt: '2026-10-02T10:00:00.000Z',
            priceAlert: 55000,
            targetPrice: 55000,
          },
        ],
      };

      const result = wishlistReducer(
        stateWithTwo,
        setPriceAlert({ productId: 'laptop-1', targetPrice: 41000 }),
      );

      expect(result.items[0].priceAlert).toBe(41000);
      expect(result.items[1].priceAlert).toBe(55000);
      expect(result.items[1].savedPrice).toBe(60000);
    });

    it('does not create a wishlist item when the product is absent', () => {
      const state = wishlistReducer(
        initialState,
        setPriceAlert({ productId: 'nonexistent-laptop', targetPrice: 30000 }),
      );

      expect(state.items).toHaveLength(0);
    });

    it('handles invalid or non-positive target prices safely', () => {
      const stateWithItem = {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 45000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: 40000,
            targetPrice: 40000,
          },
        ],
      };

      // Negative price
      expect(
        wishlistReducer(stateWithItem, setPriceAlert({ productId: 'laptop-1', targetPrice: -500 }))
          .items[0].priceAlert,
      ).toBe(40000);

      // Zero price
      expect(
        wishlistReducer(stateWithItem, setPriceAlert({ productId: 'laptop-1', targetPrice: 0 }))
          .items[0].priceAlert,
      ).toBe(40000);

      // Non-numeric string
      expect(
        wishlistReducer(
          stateWithItem,
          setPriceAlert({ productId: 'laptop-1', targetPrice: 'cheap' }),
        ).items[0].priceAlert,
      ).toBe(40000);

      // NaN
      expect(
        wishlistReducer(stateWithItem, setPriceAlert({ productId: 'laptop-1', targetPrice: NaN }))
          .items[0].priceAlert,
      ).toBe(40000);

      // Missing targetPrice
      expect(
        wishlistReducer(stateWithItem, setPriceAlert({ productId: 'laptop-1' })).items[0]
          .priceAlert,
      ).toBe(40000);

      // Invalid / missing payload
      expect(wishlistReducer(stateWithItem, setPriceAlert(null)).items[0].priceAlert).toBe(40000);
    });
  });

  describe('removeFromWishlist', () => {
    it('removes an existing product from wishlist', () => {
      const stateWithItem = {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 45000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
        ],
      };

      const result = wishlistReducer(stateWithItem, removeFromWishlist('laptop-1'));
      expect(result.items).toHaveLength(0);
    });

    it('keeps unrelated wishlist items', () => {
      const stateWithTwo = {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 45000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
          {
            productId: 'laptop-2',
            savedPrice: 60000,
            savedAt: '2026-10-02T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
        ],
      };

      const result = wishlistReducer(stateWithTwo, removeFromWishlist('laptop-1'));
      expect(result.items).toHaveLength(1);
      expect(result.items[0].productId).toBe('laptop-2');
    });

    it('handles a product ID that does not exist without error', () => {
      const stateWithItem = {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 45000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
        ],
      };

      const result = wishlistReducer(stateWithItem, removeFromWishlist('nonexistent-id'));
      expect(result.items).toHaveLength(1);
      expect(result.items[0].productId).toBe('laptop-1');
    });

    it('accepts payload as an object with productId', () => {
      const stateWithItem = {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 45000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
        ],
      };

      const result = wishlistReducer(stateWithItem, removeFromWishlist({ productId: 'laptop-1' }));
      expect(result.items).toHaveLength(0);
    });

    it('handles missing or invalid payload safely', () => {
      const stateWithItem = {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 45000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
        ],
      };

      expect(wishlistReducer(stateWithItem, removeFromWishlist()).items).toHaveLength(1);
      expect(wishlistReducer(stateWithItem, removeFromWishlist(null)).items).toHaveLength(1);
      expect(
        wishlistReducer(stateWithItem, removeFromWishlist({ productId: '' })).items,
      ).toHaveLength(1);
    });
  });

  describe('clearWishlist', () => {
    it('clears all items in the wishlist', () => {
      const stateWithTwo = {
        items: [
          { productId: 'laptop-1', savedPrice: 45000 },
          { productId: 'laptop-2', savedPrice: 60000 },
        ],
      };

      const result = wishlistReducer(stateWithTwo, clearWishlist());
      expect(result.items).toEqual([]);
    });
  });

  describe('Selectors', () => {
    const mockState = {
      wishlist: {
        items: [
          {
            productId: 'laptop-1',
            savedPrice: 42000,
            savedAt: '2026-10-01T10:00:00.000Z',
            priceAlert: 40000,
            targetPrice: 40000,
          },
          {
            productId: 'laptop-2',
            savedPrice: 75000,
            savedAt: '2026-10-02T10:00:00.000Z',
            priceAlert: null,
            targetPrice: null,
          },
        ],
      },
    };

    it('selectWishlistItems returns all items', () => {
      expect(selectWishlistItems(mockState)).toHaveLength(2);
      expect(selectWishlistItems(mockState)[0].productId).toBe('laptop-1');
    });

    it('selectWishlistCount returns the number of items', () => {
      expect(selectWishlistCount(mockState)).toBe(2);
      expect(selectWishlistCount({ wishlist: { items: [] } })).toBe(0);
    });

    it('selectWishlistIds returns array of product IDs', () => {
      expect(selectWishlistIds(mockState)).toEqual(['laptop-1', 'laptop-2']);
      expect(selectWishlistIds({ wishlist: { items: [] } })).toEqual([]);
    });

    it('selectIsInWishlist checks if product is in wishlist', () => {
      expect(selectIsInWishlist(mockState, 'laptop-1')).toBe(true);
      expect(selectIsInWishlist(mockState, 'laptop-2')).toBe(true);
      expect(selectIsInWishlist(mockState, 'laptop-3')).toBe(false);
    });

    it('selectWishlistItemById retrieves item by productId', () => {
      expect(selectWishlistItemById(mockState, 'laptop-1')).toEqual(mockState.wishlist.items[0]);
      expect(selectWishlistItemById(mockState, 'nonexistent')).toBeNull();
    });
  });

  describe('Persistence Integration', () => {
    it('restores preloaded wishlist state correctly', () => {
      const savedItems = [
        {
          productId: 'laptop-restored',
          savedPrice: 52000,
          savedAt: '2026-11-01T12:00:00.000Z',
          priceAlert: 49000,
          targetPrice: 49000,
        },
      ];

      const store = configureStore({
        reducer: { wishlist: wishlistReducer },
        preloadedState: { wishlist: { items: savedItems } },
      });

      expect(selectWishlistItems(store.getState())).toEqual(savedItems);
      expect(selectIsInWishlist(store.getState(), 'laptop-restored')).toBe(true);
    });

    it('maintains state integrity when dispatches occur in Redux store', () => {
      const store = configureStore({
        reducer: { wishlist: wishlistReducer },
      });

      store.dispatch(toggleWishlist({ productId: 'laptop-10', price: 65000 }));
      expect(selectWishlistCount(store.getState())).toBe(1);

      store.dispatch(setPriceAlert({ productId: 'laptop-10', targetPrice: 60000 }));
      expect(selectWishlistItemById(store.getState(), 'laptop-10').priceAlert).toBe(60000);

      store.dispatch(removeFromWishlist('laptop-10'));
      expect(selectWishlistCount(store.getState())).toBe(0);
    });
  });

  describe('Price Alert Toggle & Enabled Actions (AB-07)', () => {
    const stateWithItem = {
      items: [
        {
          productId: 'laptop-1',
          savedPrice: 45000,
          savedAt: '2026-10-01T10:00:00.000Z',
          priceAlert: null,
          targetPrice: null,
        },
        {
          productId: 'laptop-2',
          savedPrice: 60000,
          savedAt: '2026-10-02T10:00:00.000Z',
          priceAlert: 55000,
          targetPrice: 55000,
        },
      ],
    };

    it('togglePriceAlert enables price alert when currently null', () => {
      const result = wishlistReducer(stateWithItem, togglePriceAlert('laptop-1'));
      expect(result.items[0].priceAlert).toBe(45000);
      expect(result.items[1].priceAlert).toBe(55000); // other items unchanged
    });

    it('togglePriceAlert disables price alert when currently active', () => {
      const result = wishlistReducer(stateWithItem, togglePriceAlert('laptop-2'));
      expect(result.items[1].priceAlert).toBeNull();
      expect(result.items[1].targetPrice).toBeNull();
    });

    it('togglePriceAlert accepts object payload with price', () => {
      const result = wishlistReducer(
        stateWithItem,
        togglePriceAlert({ productId: 'laptop-1', price: 40000 }),
      );
      expect(result.items[0].priceAlert).toBe(40000);
    });

    it('setPriceAlertEnabled sets enabled state explicitly', () => {
      const enabledResult = wishlistReducer(
        stateWithItem,
        setPriceAlertEnabled({ productId: 'laptop-1', enabled: true, targetPrice: 42000 }),
      );
      expect(enabledResult.items[0].priceAlert).toBe(42000);

      const disabledResult = wishlistReducer(
        enabledResult,
        setPriceAlertEnabled({ productId: 'laptop-1', enabled: false }),
      );
      expect(disabledResult.items[0].priceAlert).toBeNull();
    });

    it('selectIsPriceAlertEnabled returns correct boolean state', () => {
      const testState = { wishlist: stateWithItem };
      expect(selectIsPriceAlertEnabled(testState, 'laptop-1')).toBe(false);
      expect(selectIsPriceAlertEnabled(testState, 'laptop-2')).toBe(true);
      expect(selectIsPriceAlertEnabled(testState, 'nonexistent')).toBe(false);
    });
  });
});
