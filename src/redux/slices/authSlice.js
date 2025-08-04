import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import setAuthToken from '../../utils/setAuthToken';

// Load user thunk
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to load user');
  }
});

// Login user thunk
export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    console.log('Login attempt with:', formData.email);
    const res = await api.post('/users/login', formData);
    console.log('Login response:', res.data);
    
    // Set token in localStorage and axios headers
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    
    return res.data;
  } catch (err) {
    console.error('Login error details:', err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.msg || 'Login failed');
  }
});

// Register user thunk - update similarly
export const register = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    console.log('Register attempt with:', formData.email);
    const res = await api.post('/users/register', formData);
    console.log('Register response:', res.data);
    
    // Set token in localStorage and axios headers
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    
    return res.data;
  } catch (err) {
    console.error('Register error details:', err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.msg || 'Registration failed');
  }
});

// Logout user thunk
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  setAuthToken(null);
  return null;
});

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;