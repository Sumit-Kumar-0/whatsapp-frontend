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
  const response = await api.get(`/admin/config/${configId}`);
  return response.data;
};

// Add config
export const createConfig = async (configData) => {
  const response = await api.post("/admin/config", configData);
  return response.data;
};

// Update config
export const updateConfig = async (configId, configData) => {
  const response = await api.put(`/admin/config/${configId}`, configData);
  return response.data;
};

// Delete config
export const deleteConfig = async (configId) => {
  console.log(configId, ">>>>>>>>>>> Deleting config");
  const response = await api.delete(`/admin/config/${configId}`);
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