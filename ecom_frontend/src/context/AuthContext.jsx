import React, {createContext, useState, useEffect} from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role")); // Store role (ADMIN/USER)

    useEffect(() => {
        if (token) {
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/authenticate", {email, password});
            const jwt = res.data.token;
            const userRole = res.data.role; 

            localStorage.setItem("token", jwt);
            localStorage.setItem("role", userRole);

            setToken(jwt);
            setRole(userRole);
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
            const userRole = res.data.role;

            localStorage.setItem("token", jwt);
            localStorage.setItem("role", userRole);

            setRole(userRole);
            setToken(jwt);
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
    };

    return (
        <AuthContext.Provider value={{token, role, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};