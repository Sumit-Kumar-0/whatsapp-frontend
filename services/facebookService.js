import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Save business data after Embedded Signup
const saveBusinessData = async (businessData) => {
  const response = await axios.post(`${API_URL}/facebook`, {
    action: 'signup_callback',
    wabaData: businessData.wabaData,
    userId: businessData.userId
  });
  return response.data;
};

// Exchange token code for access token
const exchangeToken = async (tokenData) => {
  const response = await axios.post(`${API_URL}/facebook`, {
    action: 'exchange_token',
    code: tokenData.code,
    userId: tokenData.userId
  });
  return response.data;
};

// Get user's business accounts
const getBusinessAccounts = async (userId) => {
  const response = await axios.get(`${API_URL}/facebook/${userId}/businesses`);
  return response.data;
};

// Get specific business account details
const getBusinessAccount = async (businessId) => {
  const response = await axios.get(`${API_URL}/facebook/business/${businessId}`);
  return response.data;
};

const facebookService = {
  saveBusinessData,
  exchangeToken,
  getBusinessAccounts,
  getBusinessAccount
};

export default facebookService;