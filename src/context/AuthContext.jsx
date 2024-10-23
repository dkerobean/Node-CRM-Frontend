import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if JWT token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token here if needed (you could make an API call to validate it)
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/"); // Redirect to login if token is missing
    }
    setLoading(false); // Set loading to false after token check
  }, [navigate]);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const value = {
    isAuthenticated,
    logout,
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
