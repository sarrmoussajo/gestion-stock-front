/* eslint-disable no-unused-vars */
import AddFrais from 'views/pages/frais/AddFrais';
import EditFrais from 'views/pages/frais/EditFrais';
import ReadFrais from 'views/pages/frais/ReadFrais';

const { default: MainLayout } = require('layout/MainLayout');

const FraisRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'frais',
            children: [
                {
                    path: 'index',
                    element: <ReadFrais />
                }
            ]
        },
        {
            path: 'frais',
            children: [
                {
                    path: 'create',
                    element: <AddFrais />
                }
            ]
        },
        {
            path: 'frais',
            children: [
                {
                    path: 'edit/:id',
                    element: <EditFrais />
                }
            ]
        }
    ]
};
export default FraisRoutes;
