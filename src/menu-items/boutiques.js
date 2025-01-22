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

//const { token } = AuthUser();
//if (token) {
const boutiques = {
    id: 'boutiques',
    title: 'Showroom',
    type: 'group',
    group: ['Admin', 'Caissier', 'Gerant'],
    children: [
        {
            id: 'boutique-index',
            title: 'Les Showrooms',
            type: 'item',
            url: '/boutique/index',
            breadcrumbs: false,
            user: 'Admin',
            icon: icons.IconArticleFilledFilled
        },
        {
            id: 'boutique-index',
            title: 'Les Showrooms',
            type: 'item',
            url: '/boutique/index',
            breadcrumbs: false,
            user: 'Gerant',
            icon: icons.IconArticleFilledFilled
        },
        {
            id: 'boutique-add',
            title: 'Nouveau Showroom',
            type: 'item',
            url: '/boutique/create',
            breadcrumbs: false,
            user: 'Admin',
            icon: icons.IconSquareRoundedPlusFilled
        },
        {
            id: 'boutique-article',
            title: 'Showroom',
            type: 'item',
            url: '/boutique/article/',
            breadcrumbs: false,
            user: 'Caissier',
            icon: icons.IconSquareRoundedPlusFilled
        },
        {
            id: 'boutique-chargement',
            title: 'Envoyer vers Showroom',
            type: 'item',
            url: '/boutique/charger',
            breadcrumbs: false,
            user: 'Gerant',
            icon: icons.IconSquareRoundedPlusFilled
        }
    ]
};
//}
export default boutiques;
