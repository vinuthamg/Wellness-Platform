import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sessionReducer from './slices/sessionSlice';
import draftReducer from './slices/draftSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionReducer,
    drafts: draftReducer
  }
});

export default store;