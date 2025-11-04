import api from "../api";

// Get all configs
export const getConfigs = async (includeSensitive = false) => {
  const response = await api.get("/admin/configs", { 
    params: { includeSensitive } 
  });
  return response.data;
};

// Get config by ID
export const getConfigById = async (configId) => {
  const response = await api.get(`/admin/configs/${configId}`);
  return response.data;
};

// Add config
export const createConfig = async (configData) => {
  const response = await api.post("/admin/configs", configData);
  return response.data;
};

// Update config
export const updateConfig = async (configId, configData) => {
  const response = await api.put(`/admin/configs/${configId}`, configData);
  return response.data;
};

// Delete config
export const deleteConfig = async (configId) => {
  const response = await api.delete(`/admin/configs/${configId}`);
  return response.data;
};

// Get public configs
export const getPublicConfigs = async () => {
  const response = await api.get("/config/public");
  return response.data;
};

const configService = {
  getConfigs,
  getConfigById,
  createConfig,
  updateConfig,
  deleteConfig,
  getPublicConfigs
};

export default configService;