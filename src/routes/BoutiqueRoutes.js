/* eslint-disable no-unused-vars */
import MainLayout from 'layout/MainLayout';
import ReadArticle from 'views/pages/articles/ReadArticle';
import AddBoutique from 'views/pages/boutiques/AddBoutique';
import ChargerBoutique from 'views/pages/boutiques/ChargerBoutique';
import EditBoutique from 'views/pages/boutiques/EditBoutique';
import FormInventaire from 'views/pages/boutiques/FormInventaire';
import Inventaire from 'views/pages/boutiques/FormInventaire';
import ReadBoutique from 'views/pages/boutiques/ReadBoutique';
import ReadVente from 'views/pages/ventes/ReadVentes';
const BoutiqueRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'boutique',
            children: [
                {
                    path: 'index',
                    element: <ReadBoutique />
                }
            ]
        },
        {
            path: 'boutique',
            children: [
                {
                    path: 'create',
                    element: <AddBoutique />
                }
            ]
        },
        {
            path: 'boutique',
            children: [
                {
                    path: 'edit/:id',
                    element: <EditBoutique />
                }
            ]
        },
        {
            path: 'boutique',
            children: [
                {
                    path: 'charger',
                    element: <ChargerBoutique />
                }
            ]
        },
        {
            path: 'boutique',
            children: [
                {
                    path: 'article',
                    element: <ReadArticle />
                }
            ]
        },
        {
            path: 'boutique',
            children: [
                {
                    path: 'article/:place/:id',
                    element: <ReadArticle />
                }
            ]
        },
        {
            path: 'boutique',
            children: [
                {
                    path: 'vente/index/:id',
                    element: <ReadVente />
                }
            ]
        },
        {
            path: 'boutique',
            children: [
                {
                    path: 'inventaire',
                    element: <FormInventaire />
                }
            ]
        }
    ]
};

export default BoutiqueRoutes;
