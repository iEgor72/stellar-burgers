import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import { createOrder } from './order';

import type { TIngredient, TConstructorState } from '@utils-types';

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: { bun: null, ingredients: [] } as TConstructorState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        if (action.payload.type === 'bun') state.bun = action.payload;
        else state.ingredients.push(action.payload);
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      )
        return;
      const [item] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },
  },
  extraReducers: (builder) =>
    builder.addCase(createOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    }),
});
export const { addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;
export default constructorSlice.reducer;
