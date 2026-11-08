import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logout } from './user';

import type { TOrder } from '@utils-types';
export const loadOrders = createAsyncThunk('orders/load', getOrdersApi);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [] as TOrder[],
    isLoading: false,
    error: null as string | null,
    requestId: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(logout.fulfilled, (state) => {
        state.items = [];
        state.requestId = null;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(loadOrders.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      }),
});
export default ordersSlice.reducer;
