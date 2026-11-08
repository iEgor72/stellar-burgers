import { combineReducers } from '@reduxjs/toolkit';

import {
  ingredientsReducer,
  constructorReducer,
  feedReducer,
  ordersReducer,
  orderReducer,
} from './slices/data';
import userReducer from './slices/user';
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
  order: orderReducer,
  user: userReducer,
});
