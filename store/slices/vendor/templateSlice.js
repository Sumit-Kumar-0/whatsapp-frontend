import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import templateService from "../../../services/vendor/templateService";

// Async thunks
export const fetchTemplates = createAsyncThunk(
  "templates/fetchTemplates",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      // Add user context to filters if needed
      const state = getState();
      const user = state.auth?.user;
      if (user?.id) {
        filters.userId = user.id;
      }
      
      const res = await templateService.getTemplates(filters);
      if (res && res.success) {
        return res;
      } else {
        return rejectWithValue(res.message || "Failed to fetch templates");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch templates"
      );
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  "templates/fetchTemplateById",
  async (templateId, { rejectWithValue }) => {
    try {
      const res = await templateService.getTemplateById(templateId);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to fetch template");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch template"
      );
    }
  }
);

export const addTemplate = createAsyncThunk(
  "templates/addTemplate",
  async (templateData, { rejectWithValue, getState }) => {
    try {
      // Add user context to template data
      const state = getState();
      const user = state.auth?.user;
      if (user?.id) {
        templateData.userId = user.id;
      }
      
      const res = await templateService.createTemplate(templateData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to create template");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create template"
      );
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "templates/updateTemplate",
  async ({ templateId, templateData }, { rejectWithValue }) => {
    try {
      const res = await templateService.updateTemplate(templateId, templateData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to update template");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update template"
      );
    }
  }
);

export const submitTemplateForApproval = createAsyncThunk(
  "templates/submitTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      const res = await templateService.submitTemplate(templateId);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to submit template");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to submit template"
      );
    }
  }
);

export const removeTemplate = createAsyncThunk(
  "templates/deleteTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      const res = await templateService.deleteTemplate(templateId);
      if (res && res.success) {
        return templateId;
      } else {
        return rejectWithValue(res.message || "Failed to delete template");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete template"
      );
    }
  }
);

export const fetchTemplateAnalytics = createAsyncThunk(
  "templates/fetchAnalytics",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      // Add user context to filters
      const state = getState();
      const user = state.auth?.user;
      if (user?.id) {
        filters.userId = user.id;
      }
      
      const res = await templateService.getTemplateAnalytics(filters);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to fetch analytics");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch analytics"
      );
    }
  }
);

export const syncTemplatesFromMeta = createAsyncThunk(
  "templates/syncFromMeta",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = state.auth?.user;
      if (!user?.id) {
        return rejectWithValue("User not authenticated");
      }
      
      const res = await templateService.syncTemplatesFromMeta();
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to sync templates");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to sync templates"
      );
    }
  }
);

const templateSlice = createSlice({
  name: "templates",
  initialState: {
    loading: false,
    list: [],
    currentTemplate: null,
    analytics: [],
    metaTemplates: [],
    pagination: {},
    error: null,
    success: false,
    syncLoading: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    clearMetaTemplates: (state) => {
      state.metaTemplates = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.pagination = action.payload.pagination || {};
        state.success = true;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch Template By ID
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
        state.success = true;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add Template
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.success = true;
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(template => template._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentTemplate && state.currentTemplate._id === action.payload._id) {
          state.currentTemplate = action.payload;
        }
        state.success = true;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Submit Template
      .addCase(submitTemplateForApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitTemplateForApproval.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(template => template._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentTemplate && state.currentTemplate._id === action.payload._id) {
          state.currentTemplate = action.payload;
        }
        state.success = true;
      })
      .addCase(submitTemplateForApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete Template
      .addCase(removeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(template => template._id !== action.payload);
        if (state.currentTemplate && state.currentTemplate._id === action.payload) {
          state.currentTemplate = null;
        }
        state.success = true;
      })
      .addCase(removeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch Analytics
      .addCase(fetchTemplateAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchTemplateAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
        state.success = true;
      })
      .addCase(fetchTemplateAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Sync Templates from Meta
      .addCase(syncTemplatesFromMeta.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(syncTemplatesFromMeta.fulfilled, (state, action) => {
        state.syncLoading = false;
        state.metaTemplates = action.payload;
        state.success = true;
      })
      .addCase(syncTemplatesFromMeta.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearCurrentTemplate, 
  clearMetaTemplates 
} = templateSlice.actions;
export default templateSlice.reducer;