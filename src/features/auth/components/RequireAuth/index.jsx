import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { PATHS } from '@shared/constants';

import { selectCurrentUser, selectIsAuthenticated } from '../../authSlice';

/**
 * Sends guests to the sign in page and brings them back after it.
 * Preserves the requested location in React Router location state `from`.
 */
function RequireAuth({ children, redirectTo = PATHS.AUTH }) {
  const isAuthenticated = useSelector(
    (state) => selectIsAuthenticated?.(state) ?? Boolean(selectCurrentUser(state)),
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
}

export default RequireAuth;
