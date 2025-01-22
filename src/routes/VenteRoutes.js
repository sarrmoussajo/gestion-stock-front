import MainLayout from 'layout/MainLayout';
import AnnulerSolde from 'views/pages/ventes/AnnulerSolde';
import AnnulerVente from 'views/pages/ventes/AnnulerVente';
import FaireVente from 'views/pages/ventes/FaireVente';
import ReadVente from 'views/pages/ventes/ReadVentes';
import SolderPrix from 'views/pages/ventes/SolderPrix';
const VenteRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'vente',
            children: [
                {
                    path: 'index',
                    element: <ReadVente />
                }
            ]
        },
        {
            path: 'vente',
            children: [
                {
                    path: 'create',
                    element: <FaireVente />
                }
            ]
        },
        {
            path: 'vente',
            children: [
                {
                    path: 'cancel',
                    element: <AnnulerVente />
                }
            ]
        },
        {
            path: 'solder',
            children: [
                {
                    path: 'prix-article',
                    element: <SolderPrix />
                }
            ]
        },
        {
            path: 'annuler-solde',
            children: [
                {
                    path: 'prix-article',
                    element: <AnnulerSolde />
                }
            ]
        }
    ]
};

export default VenteRoutes;
