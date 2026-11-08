import {
  getIngredientsApi,
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi,
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { logout } from './user';

import type { TIngredient, TConstructorState, TOrder, TOrdersData } from '@utils-types';
export const loadIngredients = createAsyncThunk('ingredients/load', getIngredientsApi);
export const loadFeed = createAsyncThunk('feed/load', getFeedsApi);
export const loadOrders = createAsyncThunk('orders/load', getOrdersApi);
export const loadOrder = createAsyncThunk(
  'order/load',
  async (number: number) => (await getOrderByNumberApi(number)).orders[0] ?? null
);
export const createOrder = createAsyncThunk(
  'order/create',
  async (ids: string[]) => (await orderBurgerApi(ids)).order
);
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
export const { addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;
export const { closeOrder } = orderSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
export const constructorReducer = constructorSlice.reducer;
export const feedReducer = feedSlice.reducer;
export const ordersReducer = ordersSlice.reducer;
export const orderReducer = orderSlice.reducer;
