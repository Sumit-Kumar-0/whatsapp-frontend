// services/vendorService.js
import api from "./api";

// Get all vendors
export const getVendors = async (filters = {}) => {
  const response = await api.get("/admin/vendors", { params: filters });
  return response.data;
};

// Add vendor
export const createVendor = async (vendorData) => {
  const response = await api.post("/admin/vendors", vendorData);
  return response.data;
};

// Update vendor
export const updateVendor = async (vendorId, vendorData) => {
  const response = await api.put(`/admin/vendors/${vendorId}`, vendorData);
  return response.data;
};

// Delete vendor
export const deleteVendor = async (vendorId) => {
  const response = await api.delete(`/admin/vendors/${vendorId}`);
  return response.data;
};

const vendorService = {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor
};

export default vendorService;