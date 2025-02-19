import MainLayout from 'layout/MainLayout';
import AuthUser from 'views/pages/authentication/authentication3/AuthUser';
import Login from 'views/pages/authentication/authentication3/Login3';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DefaultPage = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const auth = AuthUser(); //  Vérifie l'authentification
                console.log(auth);
                if (auth) {
                    if (auth.profil === 'Gerant') {
                        navigate(`http://localhost:3000/dashboard/gerant`, { replace: true });
                    }

                } else {
                    navigate('http://localhost:3000/dashboard/gerant', { replace: true });

                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);
};
export default DefaultPage;