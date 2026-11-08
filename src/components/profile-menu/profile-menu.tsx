import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { logout } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  const error = useSelector((state) =>
    state.user.errorAction === 'user/logout/rejected' ? state.user.error : null
  );
  const { pathname } = useLocation();

  const handleLogout = (): void => {
    if (!isLoading) void dispatch(logout());
  };

  return (
    <>
      <ProfileMenuUI
        isLoading={isLoading}
        handleLogout={handleLogout}
        pathname={pathname}
      />
      {error && <p role="alert">{error}</p>}
    </>
  );
};
