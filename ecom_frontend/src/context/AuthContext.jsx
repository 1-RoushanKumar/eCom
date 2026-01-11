import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [user, setUser] = useState({
    role: localStorage.getItem("role"),
  });

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      setUser({ role: role });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token, role]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/authenticate", { email, password });
      const jwt = res.data.token;
      const userRole = res.data.role;

      localStorage.setItem("token", jwt);
      localStorage.setItem("role", userRole);

      setToken(jwt);
      setRole(userRole);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      const jwt = res.data.token;
      const userRole = res.data.role || "USER";

      localStorage.setItem("token", jwt);
      localStorage.setItem("role", userRole);

      setRole(userRole);
      setToken(jwt);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, login, register, logout, user, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
