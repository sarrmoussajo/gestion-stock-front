// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = AuthUser(); // Your authentication check function
                if (user) {
                    setIsAuthenticated(true);
                    setUserProfile(user.profil);
                } else {
                    setIsAuthenticated(false);
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                setIsAuthenticated(false);
                navigate('/login', { replace: true });
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);