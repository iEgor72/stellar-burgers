import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@api';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { setCookie, deleteCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';
const saveTokens = (data: {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}): TUser => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.user;
};
export const login = createAsyncThunk('user/login', async (data: TLoginData) =>
  saveTokens(await loginUserApi(data))
);
export const register = createAsyncThunk('user/register', async (data: TRegisterData) =>
  saveTokens(await registerUserApi(data))
);
export const checkUser = createAsyncThunk('user/check', async () => {
  if (!localStorage.getItem('refreshToken')) return null;
  try {
    return (await getUserApi()).user;
  } catch {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
});
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => (await updateUserApi(data)).user
);
export const logout = createAsyncThunk('user/logout', async () => {
  const result = await logoutApi();
  if (!result.success) throw new Error('Не удалось выйти');
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as TUser | null,
    isChecked: false,
    isLoading: false,
    error: null as string | null,
    errorAction: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(checkUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isChecked = true;
      })
      .addCase(checkUser.rejected, (state) => {
        state.isChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(login.fulfilled, register.fulfilled, updateUser.fulfilled),
        (state, action) => {
          state.user = action.payload;
          state.isLoading = false;
          state.error = null;
          state.errorAction = null;
        }
      )
      .addMatcher(
        isAnyOf(login.pending, register.pending, updateUser.pending, logout.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.errorAction = null;
        }
      )
      .addMatcher(
        isAnyOf(login.rejected, register.rejected, updateUser.rejected, logout.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ?? 'Ошибка запроса';
          state.errorAction = action.type;
        }
      ),
});
export default userSlice.reducer;

export const forgotPassword = createAsyncThunk('user/forgotPassword', forgotPasswordApi);
export const resetPassword = createAsyncThunk('user/resetPassword', resetPasswordApi);
