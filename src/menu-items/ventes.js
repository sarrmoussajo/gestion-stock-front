// assets
import { IconPlus, IconList, IconCoin, IconBan, IconShoppingCart } from '@tabler/icons';
import { IconArticleFilledFilled, IconSquareRoundedPlusFilled } from '@tabler/icons-react';

// constant
const icons = {
    IconPlus,
    IconList,
    IconCoin,
    IconArticleFilledFilled,
    IconSquareRoundedPlusFilled,
    IconBan,
    IconShoppingCart
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const ventes = {
    id: 'ventes',
    title: 'Ventes',
    type: 'group',
    group: ['Caissier'],
    children: [
        {
            id: 'vente-index',
            title: 'Les Ventes',
            type: 'item',
            url: '/vente/index',
            breadcrumbs: false,
            icon: icons.IconArticleFilledFilled,
            user: 'Caissier'
        },

        {
            id: 'vente-add',
            title: 'Effectuer une vente',
            type: 'item',
            url: '/vente/create',
            breadcrumbs: false,
            icon: icons.IconShoppingCart,
            user: 'Caissier'
        },

        {
            id: 'vente-cancel',
            title: 'Annuler une vente',
            type: 'item',
            url: '/vente/cancel',
            breadcrumbs: false,
            icon: icons.IconBan,
            user: 'Caissier'
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

export default ventes;
