import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Get all user drafts
export const getDrafts = createAsyncThunk('drafts/getDrafts', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/drafts');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to fetch drafts');
  }
});

// Get draft by ID
export const getDraftById = createAsyncThunk('drafts/getDraftById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/drafts/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to fetch draft');
  }
});

// Create new draft
export const createDraft = createAsyncThunk('drafts/createDraft', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/drafts', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to create draft');
  }
});

// Update draft (auto-save)
export const updateDraft = createAsyncThunk('drafts/updateDraft', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/drafts/${id}`, formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to update draft');
  }
});

// Delete draft
export const deleteDraft = createAsyncThunk('drafts/deleteDraft', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/drafts/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data.msg || 'Failed to delete draft');
  }
});

const initialState = {
  drafts: [],
  currentDraft: null,
  loading: false,
  error: null,
  lastSaved: null
};

const draftSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    clearDraftError: (state) => {
      state.error = null;
    },
    clearCurrentDraft: (state) => {
      state.currentDraft = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDrafts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDrafts.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = action.payload;
      })
      .addCase(getDrafts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDraftById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDraftById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDraft = action.payload;
      })
      .addCase(getDraftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDraft.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts.push(action.payload);
        state.currentDraft = action.payload;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDraft.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = state.drafts.map(draft =>
          draft._id === action.payload._id ? action.payload : draft
        );
        state.currentDraft = action.payload;
        state.lastSaved = new Date().toISOString();
      })
      .addCase(updateDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDraft.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = state.drafts.filter(draft => draft._id !== action.payload);
        if (state.currentDraft && state.currentDraft._id === action.payload) {
          state.currentDraft = null;
        }
      })
      .addCase(deleteDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDraftError, clearCurrentDraft } = draftSlice.actions;
export default draftSlice.reducer;