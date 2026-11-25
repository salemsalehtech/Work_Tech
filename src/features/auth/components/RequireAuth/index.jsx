import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { PATHS } from '@shared/constants';

import { selectCurrentUser } from '../../authSlice';

/** Parent route of the account pages: sends guests to sign in, and brings them back after it. */
function RequireAuth() {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!user) return <Navigate to={PATHS.AUTH} replace state={{ from: location }} />;
  return <Outlet />;
}

export default RequireAuth;
