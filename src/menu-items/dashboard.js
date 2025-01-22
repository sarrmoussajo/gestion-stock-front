// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Statistiques',
    type: 'group',
    group: ['Admin', 'Caissier', 'Gerant'],
    children: [
        {
            id: 'default',
            title: 'Tableau de Bord',
            type: 'item',
            url: '/dashboard/admin',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            user: 'Admin'
        },
        {
            id: 'audit',
            title: 'Audit',
            type: 'item',
            url: '/audit/admin',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            user: 'Admin'
        },
        {
            id: 'boutique-inventaire',
            title: 'Inventaire',
            type: 'item',
            url: '/boutique/inventaire/',
            breadcrumbs: false,
            user: 'Admin',
            icon: icons.IconDashboard
        },
        {
            id: 'boutique-inventaire',
            title: 'Inventaire',
            type: 'item',
            url: '/boutique/inventaire/',
            breadcrumbs: false,
            user: 'Gerant',
            icon: icons.IconDashboard
        },
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/caissier',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            user: 'Caissier'
        },
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/gerant',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            user: 'Gerant'
        }
    ]
};

export default dashboard;
