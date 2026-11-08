import { useEffect } from 'react';

import { loadFeed } from './slices/feed';
import { loadOrders } from './slices/orders';
import { useDispatch } from './store';
export const useOrders = (personal = false): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (personal) void dispatch(loadOrders());
    else void dispatch(loadFeed());
  }, [dispatch, personal]);
};
