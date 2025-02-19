import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthUser from 'views/pages/authentication/authentication3/AuthUser';
import Login from 'views/pages/authentication/authentication3/Login3';
import DefaultPage from 'views/pages/authentication/DefaultPage';
import { lazy } from 'react';
import MinimalLayout from 'layout/MinimalLayout';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const DefaultRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/*',
            element: <DefaultPage />
        }
    ]
};

export default DefaultRoutes;

