import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subscriptionPlanService from "../../../services/admin/subscriptionPlanService";

// Async thunks
export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionPlans/fetchSubscriptionPlans",
  async (_, { rejectWithValue }) => {
    try {
      const res = await subscriptionPlanService.getSubscriptionPlans();
      if (res && res.success){
        return res.data;
      }else{
        return rejectWithValue(res.message || "Failed to fetch subscription plans");
      }   
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch subscription plans"
      );
    }
  }
);

export const addSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/addSubscriptionPlan",
  async (planData, { rejectWithValue }) => {
    try {
      const res = await subscriptionPlanService.createSubscriptionPlan(planData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to add subscription plan");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add subscription plan"
      );
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/updateSubscriptionPlan",
  async ({ planId, planData }, { rejectWithValue }) => {
    try {
      const res = await subscriptionPlanService.updateSubscriptionPlan(planId, planData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to update subscription plan");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update subscription plan"
      );
    }
  }
);

export const deleteSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/deleteSubscriptionPlan",
  async (planId, { rejectWithValue }) => {
    try {
      const res = await subscriptionPlanService.deleteSubscriptionPlan(planId);
      if (res && res.success) {
        return planId;
      } else {
        return rejectWithValue(res.message || "Failed to delete subscription plan");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete subscription plan"
      );
    }
  }
);

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlans",
  initialState: {
    loading: false,
    list: [],
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscription Plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.success = true;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add Subscription Plan
      .addCase(addSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.success = true;
      })
      .addCase(addSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Subscription Plan
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(plan => plan._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete Subscription Plan
      .addCase(deleteSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(plan => plan._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess } = subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;