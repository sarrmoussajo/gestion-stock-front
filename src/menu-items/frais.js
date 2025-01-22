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

const frais = {
    id: 'frais',
    title: 'Frais',
    type: 'group',
    group: ['Caissier', 'Gerant'],
    children: [
        {
            id: 'frais-index',
            title: 'Lister',
            type: 'item',
            url: '/frais/index',
            breadcrumbs: false,
            icon: icons.IconArticleFilledFilled,
            user: 'Caissier'
        },
        {
            id: 'frais-add',
            title: 'Ajouter',
            type: 'item',
            url: '/frais/create',
            breadcrumbs: false,
            icon: icons.IconSquareRoundedPlusFilled,
            user: 'Caissier'
        },
        {
            id: 'frais-index-gerant',
            title: 'Lister',
            type: 'item',
            url: '/frais/index',
            breadcrumbs: false,
            icon: icons.IconArticleFilledFilled,
            user: 'Gerant'
        },
        {
            id: 'frais-add-gerant',
            title: 'Ajouter',
            type: 'item',
            url: '/frais/create',
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

export default frais;
