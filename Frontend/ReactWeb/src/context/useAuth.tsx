import { createContext, useContext } from "react";

export interface AuthUser {
    unique_name: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
}

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  authUser: AuthUser | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};