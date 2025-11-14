import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contactService from "../../../services/vendor/contactService";

// Async thunks
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await contactService.getContacts(filters);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to fetch contacts");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch contacts"
      );
    }
  }
);

export const fetchContactById = createAsyncThunk(
  "contacts/fetchContactById",
  async (contactId, { rejectWithValue }) => {
    try {
      const res = await contactService.getContactById(contactId);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to fetch contact");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch contact"
      );
    }
  }
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const res = await contactService.createContact(contactData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to add contact");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add contact"
      );
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ contactId, contactData }, { rejectWithValue }) => {
    try {
      const res = await contactService.updateContact(contactId, contactData);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to update contact");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update contact"
      );
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId, { rejectWithValue }) => {
    try {
      const res = await contactService.deleteContact(contactId);
      if (res && res.success) {
        return contactId;
      } else {
        return rejectWithValue(res.message || "Failed to delete contact");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete contact"
      );
    }
  }
);

export const bulkDeleteContacts = createAsyncThunk(
  "contacts/bulkDeleteContacts",
  async (contactIds, { rejectWithValue }) => {
    try {
      const res = await contactService.bulkDeleteContacts(contactIds);
      if (res && res.success) {
        return contactIds;
      } else {
        return rejectWithValue(res.message || "Failed to delete contacts");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete contacts"
      );
    }
  }
);

export const bulkAddContacts = createAsyncThunk(
  "contacts/bulkAddContacts",
  async (contacts, { rejectWithValue }) => {
    try {
      const res = await contactService.bulkCreateContacts(contacts);
      if (res && res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message || "Failed to add contacts");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add contacts"
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    loading: false,
    list: [],
    currentContact: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    },
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
    clearCurrentContact: (state) => {
      state.currentContact = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.contacts || [];
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total
        };
        state.success = true;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add Contact
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.success = true;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(contact => contact._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentContact && state.currentContact._id === action.payload._id) {
          state.currentContact = action.payload;
        }
        state.success = true;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(contact => contact._id !== action.payload);
        if (state.currentContact && state.currentContact._id === action.payload) {
          state.currentContact = null;
        }
        state.success = true;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentContact } = contactSlice.actions;
export default contactSlice.reducer;