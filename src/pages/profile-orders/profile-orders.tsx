import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

import { useSelector } from '@services/store';
import { useOrders } from '@services/use-orders';
export const ProfileOrders = (): React.JSX.Element => {
  const { items, isLoading, error } = useSelector((state) => state.orders);
  useOrders(true);
  if (isLoading && !items.length) return <Preloader />;
  return (
    <>
      {error && <p role="alert">{error}</p>}
      <ProfileOrdersUI orders={items} />
    </>
  );
};
