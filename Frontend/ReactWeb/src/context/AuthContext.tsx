import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./useAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("jwt_token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("jwt_token");
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated: !!token, 
      login, 
      logout,
      isLoading 
    }}>
      {!isLoading && children} 
    </AuthContext.Provider>
  );
}