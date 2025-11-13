import api from "../api";

// Get all contacts
export const getContacts = async (params = {}) => {
  const response = await api.get("/vendor/contacts", { params });
  return response.data;
};

// Get contact by ID
export const getContactById = async (contactId) => {
  const response = await api.get(`/vendor/contacts/${contactId}`);
  return response.data;
};

// Create contact
export const createContact = async (contactData) => {
  const response = await api.post("/vendor/contacts", contactData);
  return response.data;
};

// Update contact
export const updateContact = async (contactId, contactData) => {
  const response = await api.put(`/vendor/contacts/${contactId}`, contactData);
  return response.data;
};

// Delete contact
export const deleteContact = async (contactId) => {
  const response = await api.delete(`/vendor/contacts/${contactId}`);
  return response.data;
};

// Bulk create contacts
export const bulkCreateContacts = async (contacts) => {
  const response = await api.post("/vendor/contacts/bulk", { contacts });
  return response.data;
};

const contactService = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  bulkCreateContacts
};

export default contactService;