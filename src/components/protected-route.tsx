import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

import type { Location } from 'react-router-dom';
export const ProtectedRoute = ({
  onlyGuest = false,
}: {
  onlyGuest?: boolean;
}): React.JSX.Element => {
  const { user, isChecked } = useSelector((state) => state.user);
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;
  if (!isChecked) return <Preloader />;
  if (!onlyGuest && !user)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (onlyGuest && user) return <Navigate to={from ?? '/'} replace />;
  return <Outlet />;
};
