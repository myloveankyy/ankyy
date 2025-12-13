import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('ankyy_user');
        const token = localStorage.getItem('ankyy_token');
        if (token && savedUser) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try { setUser(JSON.parse(savedUser)); } catch (e) { localStorage.clear(); }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('ankyy_token', token);
        localStorage.setItem('ankyy_user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('ankyy_token');
        localStorage.removeItem('ankyy_user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);