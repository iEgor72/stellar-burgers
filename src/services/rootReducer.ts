import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/burger-constructor';
import feedReducer from './slices/feed';
import ingredientsReducer from './slices/ingredients';
import orderReducer from './slices/order';
import ordersReducer from './slices/orders';
import userReducer from './slices/user';
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
  order: orderReducer,
  user: userReducer,
});
