import { PATHS } from '@shared/constants';

/** Where to go after signing in: the page RequireAuth came from, else the account page. */
export function redirectPath(locationState) {
  const from = locationState?.from;
  return from?.pathname ? `${from.pathname}${from.search}${from.hash}` : PATHS.ACCOUNT;
}
