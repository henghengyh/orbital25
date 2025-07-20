import { createContext, useContext, useEffect, useState } from 'react';

import axiosInstance from '../../utils/axiosInstance';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        user: null,
        token: localStorage.getItem("token"),
        isAuthenticated: false,
        loading: true,
        logout: false,
    })

    useEffect(() => {
        if (!auth.token) {
            setAuth(prev => ({ ...prev, loading: false }));
            return;
        }
        axiosInstance.get("/protected")
            .then(res => {
                if (res.data) {
                    setAuth(prev => ({
                        ...prev,
                        user: res.data.user,
                        isAuthenticated: true,
                        loading: false,
                    }));
                }
            }).catch((err) => {
                console.error("Token validation failed:", err);
                localStorage.removeItem("token");
                setAuth({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loading: false,
                    logout: false
                });
            });
    }, [auth.token]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}