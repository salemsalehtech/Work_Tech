import { describe, expect, it, vi } from 'vitest';

import { buildOrder } from './buildOrder.js';

describe('buildOrder', () => {
  it('builds an order with the expected structure', () => {
    vi.spyOn(Date, 'now').mockReturnValue(123456);

    const order = buildOrder({
      user: { id: 'demo-user-1' },
      items: [
        {
          productId: 'lenovo-loq-15irx9',
          kind: 'laptop',
          name: 'Lenovo LOQ 15IRX9 Gaming Laptop',
          price: 66999,
          quantity: 1,
          options: {
            memory: '16 GB',
            storage: '1 TB',
            warranty: '1 year',
          },
        },
      ],
      shipping: {
        fullName: 'Marwan Tarek',
        phone: '01022334455',
        city: 'Cairo',
        address: '16 El Tayaran St',
      },
      payment: {
        method: 'card',
      },
      totals: {
        subtotal: 66999,
        shipping: 0,
        discount: 0,
        total: 66999,
      },
    });

    expect(order).toEqual({
      id: 'WT-123456',
      userId: 'demo-user-1',
      createdAt: expect.any(String),
      status: 'placed',
      items: [
        {
          productId: 'lenovo-loq-15irx9',
          kind: 'laptop',
          name: 'Lenovo LOQ 15IRX9 Gaming Laptop',
          price: 66999,
          quantity: 1,
          options: {
            memory: '16 GB',
            storage: '1 TB',
            warranty: '1 year',
          },
        },
      ],
      shipping: {
        fullName: 'Marwan Tarek',
        phone: '01022334455',
        city: 'Cairo',
        address: '16 El Tayaran St',
      },
      payment: {
        method: 'card',
      },
      totals: {
        subtotal: 66999,
        shipping: 0,
        discount: 0,
        total: 66999,
      },
    });

    vi.restoreAllMocks();
  });
});
