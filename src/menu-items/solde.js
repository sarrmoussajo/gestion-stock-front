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
    id: 'solde',
    title: 'Solde',
    type: 'group',
    group: ['Caissier'],
    children: [
        {
            id: 'solder',
            title: 'Solder',
            type: 'item',
            url: '/solder/prix-article',
            breadcrumbs: false,
            icon: icons.IconCoin,
            user: 'Caissier'
        },
        {
            id: 'annuler-solder',
            title: 'Annuler Solde',
            type: 'item',
            url: '/annuler-solde/prix-article',
            breadcrumbs: false,
            icon: icons.IconBan,
            user: 'Caissier'
        }
    ]
};

export default ventes;
