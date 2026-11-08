import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils-types';
export const loadIngredients = createAsyncThunk('ingredients/load', getIngredientsApi);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [] as TIngredient[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка загрузки';
        state.isLoading = false;
      }),
});
export default ingredientsSlice.reducer;
