import { loadState, saveState } from '@shared/utils';

// Slices kept between visits. Server data is never persisted.
export const PERSISTED_SLICES = ['cart', 'wishlist', 'compare', 'auth'];

/**
 * Reads the saved slices and lays them over each slice's initial state,
 * so a field added later still has its default for people with an older save.
 */
export function loadPersistedState(reducers) {
  return PERSISTED_SLICES.reduce((state, key) => {
    const saved = loadState(key, undefined);
    if (saved === undefined || saved === null || typeof saved !== 'object') return state;
    const initial = reducers[key](undefined, { type: '@@worktech/init' });
    return { ...state, [key]: { ...initial, ...saved } };
  }, {});
}

/** Saves a persisted slice only when it changed. Returns the unsubscribe function. */
export function persistStore(store) {
  let previous = store.getState();
  return store.subscribe(() => {
    const current = store.getState();
    PERSISTED_SLICES.forEach((key) => {
      if (current[key] !== previous[key]) saveState(key, current[key]);
    });
    previous = current;
  });
}
