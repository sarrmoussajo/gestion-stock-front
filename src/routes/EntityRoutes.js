import MainLayout from 'layout/MainLayout';
import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import AddAdmin from 'views/pages/entity/AddAdmin';
import AddEntity from 'views/pages/entity/AddEntity';
import EditEntity from 'views/pages/entity/EditEntity';
import ReadAdmin from 'views/pages/entity/ReadAdmin';
import ReadEntity from 'views/pages/entity/ReadEntity';
import AddUser from 'views/pages/users/AddUser';

const EntityRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'entity',
            children: [
                {
                    path: 'index',
                    element: <ReadEntity />
                }
            ]
        },
        {
            path: 'entity',
            children: [
                {
                    path: 'add',
                    element: <AddEntity />
                }
            ]
        },
        {
            path: 'entity',
            children: [
                {
                    path: 'admin-add',
                    element: <AddAdmin />
                }
            ]
        },
        {
            path: 'entity',
            children: [
                {
                    path: 'admin-index',
                    element: <ReadAdmin />
                }
            ]
        },
        {
            path: 'entity',
            children: [
                {
                    path: 'edit/:id',
                    element: <EditEntity />
                }
            ]
        }
    ]
};

export default EntityRoutes;
