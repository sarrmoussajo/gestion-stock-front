import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Audit from 'views/pages/audit';
import ImprimerAudit from 'views/pages/audit/ImprimerAudit';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// ==============================|| MAIN ROUTING ||============================== //

const DashboardRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'dashboard',
            element: <DashboardDefault />,
            children: [
                {
                    path: 'admin',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'audit',
            children: [
                {
                    path: 'admin',
                    element: <Audit />
                }
            ]
        },
        {
            path: 'audit',
            children: [
                {
                    path: 'imprimer/admin',
                    element: <ImprimerAudit />
                }
            ]
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />,
            children: [
                {
                    path: 'caissier',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />,
            children: [
                {
                    path: 'gerant',
                    element: <DashboardDefault />
                }
            ]
        }
    ]
};

export default DashboardRoutes;
