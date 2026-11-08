import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrdersData } from '@utils-types';
export const loadFeed = createAsyncThunk('feed/load', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
  } as TOrdersData & { isLoading: boolean; error: string | null },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(loadFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFeed.fulfilled, (state, { payload }) => {
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
        state.isLoading = false;
      })
      .addCase(loadFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      }),
});
export default feedSlice.reducer;
