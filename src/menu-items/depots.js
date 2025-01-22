// assets
import { IconPlus, IconList } from '@tabler/icons';
import { IconArticleFilledFilled, IconSquareRoundedPlusFilled } from '@tabler/icons-react';
// constant
const icons = {
    IconPlus,
    IconList,
    IconArticleFilledFilled,
    IconSquareRoundedPlusFilled
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const depots = {
    id: 'depots',
    title: 'Stock',
    type: 'group',
    group: ['Admin', 'Gerant'],
    children: [
        {
            id: 'depot-index',
            title: 'Etat Stock',
            type: 'item',
            url: '/depot/index',
            breadcrumbs: false,
            icon: icons.IconArticleFilledFilled,
            user: 'Admin'
        },
        {
            id: 'depot-add',
            title: 'Nouveau Stock',
            type: 'item',
            url: '/depot/create',
            breadcrumbs: false,
            icon: icons.IconSquareRoundedPlusFilled,
            user: 'Admin'
        },
        {
            id: 'depot-article',
            title: 'Etat Stock',
            type: 'item',
            url: '/depot/article/',
            breadcrumbs: false,
            user: 'Gerant',
            icon: icons.IconArticleFilledFilled
        },
        {
            id: 'depot-charger',
            title: 'Approvisionner',
            type: 'item',
            url: '/depot/charger',
            breadcrumbs: false,
            icon: icons.IconSquareRoundedPlusFilled,
            user: 'Gerant'
        }

        // {
        //     id: 'post',
        //     title: 'Lister',
        //     type: 'item',
        //     url: '/depot/index',
        //     target: true
        // },
        // {
        //     id: 'delete',
        //     title: 'Supprimer',
        //     type: 'item',
        //     url: '/depot/delete-id/',
        //     target: true
        // }
    ]
};

export default depots;
