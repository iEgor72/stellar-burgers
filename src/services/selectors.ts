import type { RootState } from './store';
export const selectIngredients = (state: RootState): RootState['ingredients']['items'] =>
  state.ingredients.items;
export const selectConstructor = (state: RootState): RootState['burgerConstructor'] =>
  state.burgerConstructor;
export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;

export const selectCachedOrder = (
  state: RootState,
  number: number
): RootState['order']['details'] =>
  state.orders.items.find((order) => order.number === number) ??
  state.feed.orders.find((order) => order.number === number) ??
  null;
