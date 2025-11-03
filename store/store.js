'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import facebookReducer from './slices/facebookSlice';
import vendorReducer from './slices/admin/vendorSlice';
import dashboardReducer from './slices/admin/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    facebook: facebookReducer,
    vendors: vendorReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;