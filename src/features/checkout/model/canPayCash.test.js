import { describe, expect, it } from 'vitest';

import { canPayCash } from './canPayCash.js';

describe('canPayCash', () => {
  it('allows cash payment below the limit', () => {
    expect(canPayCash(49999)).toBe(true);
  });

  it('rejects cash payment at the limit', () => {
    expect(canPayCash(50000)).toBe(false);
  });

  it('rejects cash payment above the limit', () => {
    expect(canPayCash(60000)).toBe(false);
  });

  it('rejects invalid totals', () => {
    expect(canPayCash(NaN)).toBe(false);
  });
});
