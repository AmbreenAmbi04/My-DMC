import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await axios.get("http://localhost:3000/api/protected", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
          // You can decode and set user info from token if needed
          setUser({ id: 1, email: "user@example.com" }); // Placeholder
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser({ id: 1, email: "user@example.com" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Get token for API calls
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    getToken,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
