'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import facebookReducer from './slices/facebookSlice';
import vendorReducer from './slices/vendorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    facebook: facebookReducer,
    vendors: vendorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;