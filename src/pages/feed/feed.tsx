import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { loadFeed } from '@services/slices/feed';
import { useDispatch, useSelector } from '@services/store';
import { useOrders } from '@services/use-orders';
export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);
  useOrders();
  if (isLoading && !orders.length) return <Preloader />;
  return (
    <>
      {error && <p role="alert">{error}</p>}
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          void dispatch(loadFeed());
        }}
      />
    </>
  );
};
