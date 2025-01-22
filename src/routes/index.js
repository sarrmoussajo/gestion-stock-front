import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import DepotRoutes from './DepotRoutes';
import BoutiqueRoutes from './BoutiqueRoutes';
import FraisRoutes from './FraisRoutes';
import UserRoutes from './UserRoutes';
import VenteRoutes from './VenteRoutes';
import DashboardRoutes from './DashboardRoutes';
import EntityRoutes from './EntityRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([
        MainRoutes,
        DashboardRoutes,
        AuthenticationRoutes,
        DepotRoutes,
        BoutiqueRoutes,
        FraisRoutes,
        UserRoutes,
        VenteRoutes,
        EntityRoutes
    ]);
}
