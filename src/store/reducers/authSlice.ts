import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LoginResponse,
  LoginRequest,
  SignUpRequest,
  UpdateRequest,
  UserData,
  UpdateResponse,
  AxiosErrorData,
  DecodedTokenData,
} from '~/types/api';
import { _signIn, _signUp } from '~/services/auth';
import { _updateUser } from '~/services/users';
import jwt_decode from 'jwt-decode';

interface AuthState {
  isLogged: boolean;
  isRegistered: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  token: string;
  login: string;
  name: string;
  userId: string;
  isLoading: boolean;
  error: string;
}

const initialState: AuthState = {
  isLogged: false,
  isRegistered: false,
  isUpdated: false,
  isDeleted: false,
  token: '',
  login: '',
  name: '',
  userId: '',
  isLoading: false,
  error: '',
};

export const signIn = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: AxiosErrorData }>(
  'auth/signIn',
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const response = await _signIn(login, password);
      return response;
    } catch (e) {
      return rejectWithValue(e as AxiosErrorData);
    }
  },
);

export const signUp = createAsyncThunk<UserData, SignUpRequest, { rejectValue: AxiosErrorData }>(
  'auth/signUp',
  async ({ name, login, password }, { rejectWithValue }) => {
    try {
      const response = await _signUp(name, login, password);
      return response;
    } catch (e) {
      return rejectWithValue(e as AxiosErrorData);
    }
  },
);

export const updateUser = createAsyncThunk<UpdateResponse | unknown, UpdateRequest, { rejectValue: AxiosErrorData }>(
  'auth/update',
  async ({ id, name, login, password }, { rejectWithValue }) => {
    try {
      const response = await _updateUser(id, name, login, password);
      return response;
    } catch (e) {
      return rejectWithValue(e as AxiosErrorData);
    }
  },
);

const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreToken: state => {
      const token = localStorage.getItem('token') || '';
      const { exp } = jwt_decode(token) as DecodedTokenData;
      const timeNow = Math.round(+new Date() / 1000);
      if (token && timeNow < exp) {
        state.token = token;
        state.isLogged = true;
      }
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setUserLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    logOut: state => {
      localStorage.removeItem('token');
      state.token = '';
      state.isLogged = false;
    },
    resetRegistrationStatus: state => {
      state.isRegistered = false;
    },
    clearError: state => {
      state.error = '';
    },
    resetIsUpdated: state => {
      state.isUpdated = false;
    },
    setIsDeleted: state => {
      state.isDeleted = true;
    },
    resetIsDeleted: state => {
      state.isDeleted = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(signIn.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLogged = true;
      state.error = '';
      const token = action.payload.token;
      state.token = token;
      setToken(token);
    });
    builder.addCase(signIn.rejected, state => {
      state.isLoading = false;
    });

    builder.addCase(signUp.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(signUp.fulfilled, state => {
      state.isLoading = false;
      state.isRegistered = true;
      state.error = '';
    });
    builder.addCase(signUp.rejected, state => {
      state.isLoading = false;
    });
    builder.addCase(updateUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.fulfilled, state => {
      state.isLoading = false;
      state.isUpdated = true;
      state.error = '';
    });
    builder.addCase(updateUser.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {
  restoreToken,
  logOut,
  resetRegistrationStatus,
  setUserId,
  setUserLogin,
  clearError,
  resetIsUpdated,
  setIsDeleted,
  resetIsDeleted,
  setUserName,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
