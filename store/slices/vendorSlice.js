import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorService from "../../services/vendorService";

// Async thunks
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await vendorService.getVendors(filters);
      if (res && res.success){
        return res.data;
      }else{
        return rejectWithValue(res.message || "Failed to fetch vendorsaaa");
      }   
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch vendorssssss"
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
        return vendorId; // Return ID for removing from state
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
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Vendor
      .addCase(addVendor.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update Vendor
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.list.findIndex(vendor => vendor._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete Vendor
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.list = state.list.filter(vendor => vendor._id !== action.payload);
      });
  },
});

export const { clearError } = vendorSlice.actions;
export default vendorSlice.reducer;