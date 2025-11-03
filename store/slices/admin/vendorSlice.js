import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorService from "../../../services/admin/vendorService";

// Async thunks
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await vendorService.getVendors(filters);
      if (res && res.success){
        return res.data;
      }else{
        return rejectWithValue(res.message || "Failed to fetch vendors");
      }   
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch vendors"
      );
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  "vendors/fetchVendorById",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await vendorService.getVendorById(vendorId);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to fetch vendor");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch vendor"
      );
    }
  }
);

export const addVendor = createAsyncThunk(
  "vendors/addVendor",
  async (vendorData, { rejectWithValue }) => {
    try {
      const res = await vendorService.createVendor(vendorData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to add vendor");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add vendor"
      );
    }
  }
);

export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async ({ vendorId, vendorData }, { rejectWithValue }) => {
    try {
      const res = await vendorService.updateVendor(vendorId, vendorData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to update vendor");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update vendor"
      );
    }
  }
);

export const deleteVendor = createAsyncThunk(
  "vendors/deleteVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await vendorService.deleteVendor(vendorId);
      if (res && res.success) {
        return vendorId;
      } else {
        return rejectWithValue(res.message || "Failed to delete vendor");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete vendor"
      );
    }
  }
);

const vendorSlice = createSlice({
  name: "vendors",
  initialState: {
    loading: false,
    list: [],
    currentVendor: null, // Added for single vendor
    error: null,
    success: false // Added for success states
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => { // Added
      state.success = false;
    },
    clearCurrentVendor: (state) => { // Added
      state.currentVendor = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.success = true;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch Vendor By ID
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVendor = action.payload;
        state.success = true;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add Vendor
      .addCase(addVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.success = true;
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(vendor => vendor._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Also update currentVendor if it's the same vendor
        if (state.currentVendor && state.currentVendor._id === action.payload._id) {
          state.currentVendor = action.payload;
        }
        state.success = true;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete Vendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(vendor => vendor._id !== action.payload);
        // Clear currentVendor if it's the deleted vendor
        if (state.currentVendor && state.currentVendor._id === action.payload) {
          state.currentVendor = null;
        }
        state.success = true;
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentVendor } = vendorSlice.actions;
export default vendorSlice.reducer;