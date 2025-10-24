import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  if (response.data.token && typeof window !== 'undefined') {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  
  // Agar verification required hai to token store mat karo
  if (response.data.token && !response.data.requiresVerification && typeof window !== 'undefined') {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

const logout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  await api.post('/auth/logout');
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  
  // Update localStorage with latest user data
  if (typeof window !== 'undefined' && response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Email verification services - YEH CHANGE KARO
const verifyEmail = async (verificationData) => {
  const response = await api.post('/auth/verify-email', verificationData);
  
  // ✅ Token store karo ONLY if email actually verified hai
  if (response.data.token && response.data.user?.isEmailVerified && typeof window !== 'undefined') {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  } else {
    // ❌ Agar verified nahi hai to clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return response.data;
}

const resendVerificationCode = async (emailData) => {
  const response = await api.post('/auth/resend-verification', emailData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  resendVerificationCode,
};

export default authService;