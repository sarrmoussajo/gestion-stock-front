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

const users = {
    id: 'users',
    title: 'Utilisateurs',
    type: 'group',
    group: ['Admin'],
    children: [
        {
            id: 'user-index',
            title: 'Les Utilisateurs',
            type: 'item',
            url: '/user/profile',
            breadcrumbs: false,
            icon: icons.IconArticleFilledFilled,
            user: 'Admin'
        },
        {
            id: 'user-add',
            title: 'Nouveau Utilisateur',
            type: 'item',
            url: '/user/create',
            breadcrumbs: false,
            icon: icons.IconSquareRoundedPlusFilled,
            user: 'Admin'
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

export default users;
