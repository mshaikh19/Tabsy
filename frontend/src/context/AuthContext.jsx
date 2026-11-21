import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { getStoredUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verify token validity on mount if a user is stored
    const stored = getStoredUser();
    if (stored) {
      authService
        .me()
        .then((u) => setUser(u))
        .catch(() => setUser(null));
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const u = await authService.login({ email, password });
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const u = await authService.register({ name, email, password });
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = { user, loading, login, register, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}