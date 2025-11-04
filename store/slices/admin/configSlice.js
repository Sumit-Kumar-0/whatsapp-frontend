import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import configService from "../../../services/admin/configService";

// Async thunks - EXACT SAME PATTERN AS VENDOR
export const fetchConfigs = createAsyncThunk(
  "configs/fetchConfigs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await configService.getConfigs(filters.includeSensitive);
      if (res && res.success){
        return res.data;
      }else{
        return rejectWithValue(res.message || "Failed to fetch configurations");
      }   
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch configurations"
      );
    }
  }
);

export const fetchConfigById = createAsyncThunk(
  "configs/fetchConfigById",
  async (configId, { rejectWithValue }) => {
    try {
      const res = await configService.getConfigById(configId);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to fetch configuration");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch configuration"
      );
    }
  }
);

export const addConfig = createAsyncThunk(
  "configs/addConfig",
  async (configData, { rejectWithValue }) => {
    try {
      const res = await configService.createConfig(configData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to add configuration");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add configuration"
      );
    }
  }
);

export const updateConfig = createAsyncThunk(
  "configs/updateConfig",
  async ({ configId, configData }, { rejectWithValue }) => {
    try {
      const res = await configService.updateConfig(configId, configData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to update configuration");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update configuration"
      );
    }
  }
);

export const deleteConfig = createAsyncThunk(
  "configs/deleteConfig",
  async (configId, { rejectWithValue }) => {
    try {
      const res = await configService.deleteConfig(configId);
      if (res && res.success) {
        return configId;
      } else {
        return rejectWithValue(res.message || "Failed to delete configuration");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete configuration"
      );
    }
  }
);

// EXACT SAME STRUCTURE AS VENDOR SLICE
const configSlice = createSlice({
  name: "configs",
  initialState: {
    loading: false,
    list: [],
    currentConfig: null, // Added for single config
    error: null,
    success: false // Added for success states
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentConfig: (state) => {
      state.currentConfig = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Configs
      .addCase(fetchConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.success = true;
      })
      .addCase(fetchConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch Config By ID
      .addCase(fetchConfigById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchConfigById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConfig = action.payload;
        state.success = true;
      })
      .addCase(fetchConfigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add Config
      .addCase(addConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.success = true;
      })
      .addCase(addConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Config
      .addCase(updateConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(config => config._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Also update currentConfig if it's the same config
        if (state.currentConfig && state.currentConfig._id === action.payload._id) {
          state.currentConfig = action.payload;
        }
        state.success = true;
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete Config
      .addCase(deleteConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(config => config._id !== action.payload);
        // Clear currentConfig if it's the deleted config
        if (state.currentConfig && state.currentConfig._id === action.payload) {
          state.currentConfig = null;
        }
        state.success = true;
      })
      .addCase(deleteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentConfig } = configSlice.actions;
export default configSlice.reducer;