import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);

            // 0. Check for Auto-Login (Shopify Redirect)
            const params = new URLSearchParams(window.location.search);
            const autoLogin = params.get("autoLogin") === "true";
            const shop = params.get("shop");

            if (autoLogin && shop) {
                try {
                    const response = await apiClient.post("/auth/shopify-login", { shop });
                    if (response.status === "success") {
                        setUser(response.user);
                        setLoading(false);
                        return; // Successfully auto-logged in
                    }
                } catch (err) {
                    console.error("Auto-login failed:", err);
                }
            }

            // 1. Initial silent check
            const response = await apiClient.get("/auth/status");
            if (response.authenticated) {
                setUser(response.user);
            } else {
                // 2. If not authenticated, maybe the access token is just expired?
                // Try a silent refresh once on mount
                try {
                    await apiClient.post("/auth/refresh");
                    const retryResponse = await apiClient.get("/auth/status");
                    if (retryResponse.authenticated) {
                        setUser(retryResponse.user);
                    } else {
                        setUser(null);
                    }
                } catch (refreshErr) {
                    setUser(null);
                }
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = (userData) => {
        setUser(userData);
        setError(null);
    };

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
