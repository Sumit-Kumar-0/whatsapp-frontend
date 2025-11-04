'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import facebookReducer from './slices/facebookSlice';
import vendorReducer from './slices/admin/vendorSlice';
import dashboardReducer from './slices/admin/dashboardSlice';
import configReducer from './slices/admin/configSlice';
import subscriptionPlanReducer from './slices/admin/subscriptionPlanSlice'; // ✅ ADD THIS

export const store = configureStore({
  reducer: {
    auth: authReducer,
    facebook: facebookReducer,
    vendors: vendorReducer,
    dashboard: dashboardReducer,
    configs: configReducer,
    subscriptionPlans: subscriptionPlanReducer, // ✅ ADD THIS
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;