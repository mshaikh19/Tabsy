import API, { setToken, setStoredUser, getStoredUser } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const authService = {
  async register(payload) {
    const { data } = await API.post("/auth/register", payload);
    const { user, accessToken } = data.data;
    setToken(accessToken);
    setStoredUser(user);
    return user;
  },

  async login(payload) {
    const { data } = await API.post("/auth/login", payload);
    const { user, accessToken } = data.data;
    setToken(accessToken);
    setStoredUser(user);
    return user;
  },

  async loginWithGoogle(credential) {
    const { data } = await API.post("/auth/google", { credential });
    const { user, accessToken } = data.data;
    setToken(accessToken);
    setStoredUser(user);
    return user;
  },

  async logout() {
    try {
      await API.post("/auth/logout");
    } finally {
      setToken(null);
      setStoredUser(null);
    }
  },

  async me() {
    const { data } = await API.get("/auth/me");
    const user = data.data.user;
    setStoredUser(user);
    return user;
  },

  async forgotPassword(destination) {
    const { data } = await API.post("/auth/forgot-password", { destination });
    return data.data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await API.post("/auth/reset-password", { token, newPassword });
    return data;
  },

  async verifyEmail(email, otp) {
    const { data } = await API.post("/auth/verify-email", { email, otp });
    return data.data;
  },

  current() {
    return getStoredUser();
  },

  getGoogleAuthUrl() {
    return `${API_BASE_URL}/api/v1/auth/google`;
  },
};