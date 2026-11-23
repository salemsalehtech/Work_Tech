import { PATHS } from '@shared/constants';

/**
 * Safely extracts the destination route from location.state.from.
 * Handles both string paths and React Router location objects.
 * Guarantees a safe internal route, falling back to PATHS.ACCOUNT if missing or invalid.
 *
 * @param {object|null|undefined} locationState - The location.state object from React Router
 * @returns {string} The safe redirect URL
 */
export function getRedirectPath(locationState) {
  const from = locationState?.from;
  if (!from) {
    return PATHS.ACCOUNT;
  }

  let path = '';
  if (typeof from === 'string') {
    path = from.trim();
  } else if (typeof from === 'object' && from !== null && typeof from.pathname === 'string') {
    const search = from.search || '';
    const hash = from.hash || '';
    path = `${from.pathname}${search}${hash}`.trim();
  }

  // Security guard: Must start with a single '/', never '//' or external protocol '://'
  if (path.startsWith('/') && !path.startsWith('//') && !path.includes('://')) {
    return path;
  }

  return PATHS.ACCOUNT;
}
