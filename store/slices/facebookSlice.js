import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import facebookService from '../../services/facebookService';

const initialState = {
  businessAccounts: [],
  currentBusiness: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  signupStatus: 'idle' // 'idle', 'loading', 'success', 'error'
};

// Async thunks
export const saveBusinessData = createAsyncThunk(
  'facebook/saveBusinessData',
  async (businessData, thunkAPI) => {
    try {
      return await facebookService.saveBusinessData(businessData);
    } catch (error) {
      const message =
        (error.response?.data?.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const exchangeToken = createAsyncThunk(
  'facebook/exchangeToken',
  async (tokenData, thunkAPI) => {
    try {
      return await facebookService.exchangeToken(tokenData);
    } catch (error) {
      const message =
        (error.response?.data?.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getBusinessAccounts = createAsyncThunk(
  'facebook/getBusinessAccounts',
  async (userId, thunkAPI) => {
    try {
      return await facebookService.getBusinessAccounts(userId);
    } catch (error) {
      const message =
        (error.response?.data?.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const facebookSlice = createSlice({
  name: 'facebook',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.signupStatus = 'idle';
    },
    setCurrentBusiness: (state, action) => {
      state.currentBusiness = action.payload;
    },
    clearBusinessData: (state) => {
      state.currentBusiness = null;
      state.businessAccounts = [];
    },
    updateSignupStatus: (state, action) => {
      state.signupStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Save Business Data
      .addCase(saveBusinessData.pending, (state) => {
        state.isLoading = true;
        state.signupStatus = 'loading';
      })
      .addCase(saveBusinessData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.signupStatus = 'success';
        state.currentBusiness = action.payload;
        state.message = 'Business account connected successfully';
        
        // Add to business accounts list if not already present
        const exists = state.businessAccounts.find(
          acc => acc.wabaId === action.payload.wabaId
        );
        if (!exists) {
          state.businessAccounts.push(action.payload);
        }
      })
      .addCase(saveBusinessData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.signupStatus = 'error';
        state.message = action.payload;
        state.currentBusiness = null;
      })
      // Exchange Token
      .addCase(exchangeToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exchangeToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Token exchanged successfully';
      })
      .addCase(exchangeToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Business Accounts
      .addCase(getBusinessAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBusinessAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.businessAccounts = action.payload;
      })
      .addCase(getBusinessAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.businessAccounts = [];
      });
  },
});

export const { 
  reset, 
  setCurrentBusiness, 
  clearBusinessData, 
  updateSignupStatus 
} = facebookSlice.actions;

export default facebookSlice.reducer;