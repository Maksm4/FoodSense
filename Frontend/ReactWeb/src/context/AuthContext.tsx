import { useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, type AuthUser } from "./useAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("jwt_token");
        if (storedToken) {
            setToken(storedToken);
            setAuthUser(jwtDecode<AuthUser>(storedToken));
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        setToken(newToken);
        setAuthUser(jwtDecode<AuthUser>(newToken));
        localStorage.setItem("jwt_token", newToken);
    };

    const logout = () => {
        setToken(null);
        setAuthUser(null);
        localStorage.removeItem("jwt_token");
    };

    return (
        <AuthContext.Provider value={{
            token,
            isAuthenticated: !!token,
            login,
            logout,
            isLoading,
            authUser,
        }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}