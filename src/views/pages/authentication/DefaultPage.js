// DefaultPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'views/pages/authentication/authentication3/AuthProvider';
const DefaultPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userProfile } = useAuth();

    React.useEffect(() => {
        if (isAuthenticated) {
            if (userProfile === 'Gerant') {
                navigate('/dashboard/gerant', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, userProfile, navigate]);

    return null; // or a loading spinner
};

export default DefaultPage;