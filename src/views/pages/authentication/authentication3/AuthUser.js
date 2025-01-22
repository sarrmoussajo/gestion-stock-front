import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

const AuthUser = () => {
    const navigate = useNavigate();

    const REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY = '2y1079K0oUJGCE3jNJATUC9Twu4ZHDgctGyfqiaOfSONeiaLx59muXRC';

    const getToken = () => {
        const tokenString = secureLocalStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken;
    };

    const getUser = () => {
        const userString = secureLocalStorage.getItem('user');
        const userDetail = JSON.parse(userString);
        return userDetail;
    };

    const [token, setToken] = useState(getToken);
    const [user, setUser] = useState(getUser);

    const saveToken = (user, token) => {
        secureLocalStorage.setItem('token', JSON.stringify(token));
        secureLocalStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        if (user.profil === 'Admin') {
            navigate('/dashboard/admin');
        } else if (user.profil === 'Super Admin') {
            navigate('/entity/index');
        } else if (user.profil === 'Caissier') {
            navigate('/dashboard/caissier');
        } else if (user.profil === 'Gerant') {
            navigate('/dashboard/gerant');
        }
    };

    const updateUser = (user) => {
        removeSessionUser();
        secureLocalStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const removeSessionUser = () => {
        secureLocalStorage.removeItem('token');
        secureLocalStorage.removeItem('user');
        return 'removed';
    };
    return {
        setToken: saveToken,
        removeSessionUser,
        getToken,
        getUser,
        updateUser,
        user,
        token
    };
};
export default AuthUser;
