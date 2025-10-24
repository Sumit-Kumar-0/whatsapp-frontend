import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import facebookReducer from './slices/facebookSlice'; // ADD THIS

export const store = configureStore({
  reducer: {
    auth: authReducer,
    facebook: facebookReducer, // ADD THIS
  },
});