import api from "./api";

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  if (response.data.token && typeof window !== "undefined") {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post("/auth/login", userData);

  if (response.data.token && !response.data.requiresVerification && typeof window !== "undefined") {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

const logout = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  await api.post("/auth/logout");
};

const getMe = async () => {
  const response = await api.get("/auth/me");

  if (typeof window !== "undefined" && response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

const verifyEmail = async (verificationData) => {
  const response = await api.post("/auth/verify-email", verificationData);

  if (response.data.token && response.data.user?.isEmailVerified && typeof window !== "undefined") {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return response.data;
};

const resendVerificationCode = async (emailData) => {
  const response = await api.post("/auth/resend-verification", emailData);
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
