import api from "../api";

// Get all templates
export const getTemplates = async (filters = {}) => {
  const response = await api.get("/vendor/templates", { params: filters });
  return response.data;
};

// Get template by ID
export const getTemplateById = async (templateId) => {
  const response = await api.get(`/vendor/templates/${templateId}`);
  return response.data;
};

// Create template
export const createTemplate = async (templateData) => {
  const response = await api.post("/vendor/templates", templateData);
  return response.data;
};

// Update template
export const updateTemplate = async (templateId, templateData) => {
  const response = await api.put(`/vendor/templates/${templateId}`, templateData);
  return response.data;
};

// Submit template for approval
export const submitTemplate = async (templateId) => {
  const response = await api.post(`/vendor/templates/${templateId}/submit`);
  return response.data;
};

// Delete template
export const deleteTemplate = async (templateId) => {
  const response = await api.delete(`/vendor/templates/${templateId}`);
  return response.data;
};

// Get template analytics
export const getTemplateAnalytics = async (filters = {}) => {
  const response = await api.get("/vendor/templates/analytics", { params: filters });
  return response.data;
};

// ✅ Sync templates from Meta - Add this function
export const syncTemplatesFromMeta = async () => {
  const response = await api.post("/vendor/templates/sync");
  return response.data;
};

const templateService = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  submitTemplate,
  deleteTemplate,
  getTemplateAnalytics,
  syncTemplatesFromMeta // ✅ Make sure this is included
};

export default templateService;