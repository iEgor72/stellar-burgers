import type { RootState } from './store';
export const selectIngredients = (state: RootState): RootState['ingredients']['items'] =>
  state.ingredients.items;
export const selectConstructor = (state: RootState): RootState['burgerConstructor'] =>
  state.burgerConstructor;
export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;
