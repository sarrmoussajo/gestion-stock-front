import MainLayout from 'layout/MainLayout';
import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import EditArticle from 'views/pages/articles/EditArticle';
import ReadArticle from 'views/pages/articles/ReadArticle';
import ChargerDepot from 'views/pages/depots/ChargerDepot';
import EditDepot from 'views/pages/depots/EditDepot';
import ReadDepot from 'views/pages/depots/ReadDepot';
const AddDepot = Loadable(lazy(() => import('views/pages/depots/AddDepot')));
const DepotRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'depot',
            children: [
                {
                    path: 'index',
                    element: <ReadDepot />
                }
            ]
        },
        {
            path: 'depot',
            children: [
                {
                    path: 'create',
                    element: <AddDepot />
                }
            ]
        },
        {
            path: 'depot',
            children: [
                {
                    path: 'edit/:id',
                    element: <EditDepot />
                }
            ]
        },
        {
            path: 'depot',
            children: [
                {
                    path: 'charger',
                    element: <ChargerDepot />
                }
            ]
        },
        {
            path: 'depot',
            children: [
                {
                    path: 'article',
                    element: <ReadArticle />
                }
            ]
        },
        {
            path: 'depot',
            children: [
                {
                    path: 'article/:place/:id',
                    element: <ReadArticle />
                }
            ]
        },
        {
            path: 'depot',
            children: [
                {
                    path: 'article/edit/:id',
                    element: <EditArticle />
                }
            ]
        }
    ]
};

export default DepotRoutes;
