import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (token) {
            localStorage.setItem("token", token);
            // Fetch user profile
            axios.get("/api/user/profile")
                .then(res => {
                    setUser(res.data.user);
                    setLoading(false);
                })
                .catch(() => {
                    setToken(null);
                    setLoading(false);
                });
        } else {
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
