import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Get all published sessions
export const getSessions = createAsyncThunk('sessions/getSessions', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/sessions');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to fetch sessions');
  }
});

// Get session by ID
export const getSessionById = createAsyncThunk('sessions/getSessionById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/sessions/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to fetch session');
  }
});

// Get user's sessions
export const getUserSessions = createAsyncThunk('sessions/getUserSessions', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/sessions/user/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to fetch user sessions');
  }
});

// Create new session
export const createSession = createAsyncThunk('sessions/createSession', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/sessions', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to create session');
  }
});

// Update session
export const updateSession = createAsyncThunk('sessions/updateSession', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/sessions/${id}`, formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to update session');
  }
});

// Delete session
export const deleteSession = createAsyncThunk('sessions/deleteSession', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/sessions/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to delete session');
  }
});

const initialState = {
  sessions: [],
  session: null,
  userSessions: [],
  loading: false,
  error: null
};

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    clearCurrentSession: (state) => {
      state.session = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSessionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSessionById.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
      })
      .addCase(getSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.userSessions = action.payload;
      })
      .addCase(getUserSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.userSessions.push(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.loading = false;
        state.userSessions = state.userSessions.map(session =>
          session._id === action.payload._id ? action.payload : session
        );
        state.session = action.payload;
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.loading = false;
        state.userSessions = state.userSessions.filter(session => session._id !== action.payload);
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSessionError, clearCurrentSession } = sessionSlice.actions;
export default sessionSlice.reducer;