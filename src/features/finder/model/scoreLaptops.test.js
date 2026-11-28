import { describe, expect, it } from 'vitest';

import { scoreLaptops } from './scoreLaptops.js';
const products = [
  {
    id: 1,
    name: 'Gaming Laptop',
    price: 1000,
    specs: {
      weight: 2.5,
      gpu: 'NVIDIA RTX 4060',
      screen: '15.6',
    },
  },
  {
    id: 2,
    name: 'Light Laptop',
    price: 900,
    specs: {
      weight: 1.2,
      gpu: 'Intel Graphics',
      screen: '14',
    },
  },
  {
    id: 3,
    name: 'Heavy Laptop',
    price: 950,
    specs: {
      weight: 1.8,
      gpu: 'Intel Graphics',
      screen: '15.6',
    },
  },
  {
    id: 4,
    name: 'Expensive Laptop',
    price: 1101,
    specs: {
      weight: 1.3,
      gpu: 'NVIDIA RTX 4060',
      screen: '14',
    },
  },
];

describe('scoreLaptops', () => {
  it('returns gaming laptops with powerful GPUs', () => {
    const result = scoreLaptops(products, {
      usage: 'gaming',
    });

    expect(result.length).toBeGreaterThan(0);

    result.forEach(({ product }) => {
      expect(product.specs.gpu).toMatch(/rtx|gtx|radeon rx/i);
    });
  });

  it('returns lightweight laptops under 1.5 kg', () => {
    const result = scoreLaptops(products, {
      portability: 'lightweight',
    });

    expect(result.length).toBeGreaterThan(0);

    result.forEach(({ product }) => {
      expect(Number.parseFloat(product.specs.weight)).toBeLessThan(1.5);
    });
  });

  it('does not exceed the budget by more than 10%', () => {
    const result = scoreLaptops(products, {
      budget: 1000,
    });

    result.forEach(({ product }) => {
      expect(product.price).toBeLessThanOrEqual(1100);
    });
  });

  it('returns a maximum of three laptops', () => {
    const result = scoreLaptops(products, {});

    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('returns an empty array for invalid products input', () => {
    expect(scoreLaptops(null, {})).toEqual([]);
  });
});
