import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';
export const loadOrder = createAsyncThunk(
  'order/load',
  async (number: number) => (await getOrderByNumberApi(number)).orders[0] ?? null
);
export const createOrder = createAsyncThunk(
  'order/create',
  async (ids: string[]) => (await orderBurgerApi(ids)).order
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    details: null as TOrder | null,
    detailsRequestId: null as string | null,
    detailsError: null as string | null,
    created: null as TOrder | null,
    isLoading: false,
    isCreating: false,
    error: null as string | null,
  },
  reducers: {
    closeOrder: (state) => {
      state.created = null;
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loadOrder.pending, (state, action) => {
        state.detailsRequestId = action.meta.requestId;
        state.details = null;
        state.isLoading = true;
        state.detailsError = null;
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId) return;
        state.details = action.payload;
        state.isLoading = false;
      })
      .addCase(loadOrder.rejected, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId) return;
        state.isLoading = false;
        state.detailsError = action.meta.aborted
          ? null
          : (action.error.message ?? 'Ошибка загрузки');
      })
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.created = action.payload;
        state.isCreating = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message ?? 'Ошибка оформления';
      }),
});
export const { closeOrder } = orderSlice.actions;
export default orderSlice.reducer;
