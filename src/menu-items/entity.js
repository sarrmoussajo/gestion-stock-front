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
const entity = {
    id: 'entity',
    title: 'Entreprise',
    type: 'group',
    group: ['Super Admin'],
    children: [
        {
            id: 'entity-add',
            title: 'Ajouter',
            type: 'item',
            url: '/entity/add',
            breadcrumbs: false,
            user: 'Super Admin',
            icon: icons.IconSquareRoundedPlusFilled
        },
        {
            id: 'entity',
            title: 'Lister',
            type: 'item',
            url: '/entity/index',
            breadcrumbs: false,
            user: 'Super Admin',
            icon: icons.IconArticleFilledFilled
        },
        {
            id: 'admin-add',
            title: 'Ajouter Admin',
            type: 'item',
            url: '/entity/admin-add',
            breadcrumbs: false,
            user: 'Super Admin',
            icon: icons.IconSquareRoundedPlusFilled
        },
        {
            id: 'admin-index',
            title: 'Lister Admin',
            type: 'item',
            url: '/entity/admin-index',
            breadcrumbs: false,
            user: 'Super Admin',
            icon: icons.IconArticleFilledFilled
        }
    ]
};
//}
export default entity;
