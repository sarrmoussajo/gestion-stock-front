/* eslint-disable no-unused-vars */
import MainLayout from 'layout/MainLayout';
import AddUser from 'views/pages/users/AddUser';
import ChooseUserProfile from 'views/pages/users/ChooseUserProfile';
import EditUser from 'views/pages/users/EditUser';
import ReadUser from 'views/pages/users/ReadUser';

const UserRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'user',
            children: [
                {
                    path: 'index',
                    element: <ReadUser />
                }
            ]
        },
        {
            path: 'user',
            children: [
                {
                    path: 'create',
                    element: <AddUser />
                }
            ]
        },
        {
            path: 'user',
            children: [
                {
                    path: 'edit/:profil/:id',
                    element: <EditUser />
                }
            ]
        },
        {
            path: 'user',
            children: [
                {
                    path: 'profile',
                    element: <ChooseUserProfile />
                }
            ]
        }
    ]
};
export default UserRoutes;
