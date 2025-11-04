import api from "../api";

// Get all subscription plans
export const getSubscriptionPlans = async () => {
  const response = await api.get("/admin/subscription-plans");
  return response.data;
};

// Get subscription plan by ID
export const getSubscriptionPlanById = async (planId) => {
  const response = await api.get(`/admin/subscription-plans/${planId}`);
  return response.data;
};

// Add subscription plan
export const createSubscriptionPlan = async (planData) => {
  const response = await api.post("/admin/subscription-plans", planData);
  return response.data;
};

// Update subscription plan
export const updateSubscriptionPlan = async (planId, planData) => {
  const response = await api.put(`/admin/subscription-plans/${planId}`, planData);
  return response.data;
};

// Delete subscription plan
export const deleteSubscriptionPlan = async (planId) => {
  const response = await api.delete(`/admin/subscription-plans/${planId}`);
  return response.data;
};

// Initialize default subscription plans
export const initializeDefaultPlans = async () => {
  const response = await api.get("/admin/subscription-plans/initialize");
  return response.data;
};

const subscriptionPlanService = {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  initializeDefaultPlans
};

export default subscriptionPlanService;