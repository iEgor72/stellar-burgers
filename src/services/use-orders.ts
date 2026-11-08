import { useEffect } from 'react';

import { loadFeed, loadOrders } from './slices/data';
import { useDispatch } from './store';
const REFRESH_INTERVAL = 15000;
export const useOrders = (personal = false): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    const refresh = (): void => {
      if (personal) void dispatch(loadOrders());
      else void dispatch(loadFeed());
    };
    refresh();
    const timer = window.setInterval(refresh, REFRESH_INTERVAL);
    window.addEventListener('focus', refresh);
    return (): void => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [dispatch, personal]);
};
