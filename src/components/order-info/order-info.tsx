import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients, selectCachedOrder } from '@services/selectors';
import { loadOrder } from '@services/slices/order';
import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const {
    details,
    isLoading,
    detailsError: error,
  } = useSelector((state) => state.order);
  const orderNumber = Number(number);
  const cachedOrder = useSelector((state) => selectCachedOrder(state, orderNumber));
  const orderData = cachedOrder ?? (details?.number === orderNumber ? details : null);
  const ingredients = useSelector(selectIngredients);
  useEffect(() => {
    if (!number || cachedOrder) return;
    const request = dispatch(loadOrder(Number(number)));
    return (): void => request.abort();
  }, [dispatch, number, cachedOrder]);
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (error && !cachedOrder) return <p role="alert">{error}</p>;
  if (!isLoading && !orderData) return <p>Заказ не найден</p>;
  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
