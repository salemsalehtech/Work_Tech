import { describe, expect, it } from 'vitest';

import { PATHS } from '@shared/constants';

import { getRedirectPath } from './redirectUtils';

describe('getRedirectPath (Redirect after authentication)', () => {
  it('returns PATHS.ACCOUNT when location state is missing or empty', () => {
    expect(getRedirectPath(undefined)).toBe(PATHS.ACCOUNT);
    expect(getRedirectPath(null)).toBe(PATHS.ACCOUNT);
    expect(getRedirectPath({})).toBe(PATHS.ACCOUNT);
    expect(getRedirectPath({ from: '' })).toBe(PATHS.ACCOUNT);
  });

  it('returns string path from location.state.from', () => {
    expect(getRedirectPath({ from: '/checkout' })).toBe('/checkout');
    expect(getRedirectPath({ from: '/orders' })).toBe('/orders');
    expect(getRedirectPath({ from: '/products/123?ref=test' })).toBe('/products/123?ref=test');
  });

  it('handles React Router Location objects in location.state.from', () => {
    const locationObj = {
      pathname: '/checkout',
      search: '?step=payment',
      hash: '#section',
    };
    expect(getRedirectPath({ from: locationObj })).toBe('/checkout?step=payment#section');
  });

  it('prevents open redirect vulnerabilities by rejecting external URLs', () => {
    expect(getRedirectPath({ from: 'https://malicious-site.com' })).toBe(PATHS.ACCOUNT);
    expect(getRedirectPath({ from: 'http://malicious-site.com/auth' })).toBe(PATHS.ACCOUNT);
    expect(getRedirectPath({ from: '//malicious-site.com' })).toBe(PATHS.ACCOUNT);
    expect(getRedirectPath({ from: 'javascript:alert(1)' })).toBe(PATHS.ACCOUNT);
  });
});
