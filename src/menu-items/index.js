import dashboard from './dashboard';
import depots from './depots';
import boutiques from './boutiques';
import users from './users';
import ventes from './ventes';
import solde from './solde';
import entity from './entity';
// import pages from './pages';
// import utilities from './utilities';
// import other from './other';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    //items: [boutiques] // pages, utilities, other

    items: [dashboard, depots, boutiques, ventes, users, entity, solde]
};

export default menuItems;
