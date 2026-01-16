import axios from 'axios';

export default axios.create({
    baseURL: `https://apigs.solux.sn/api/`
});

export const url = 'https://apigs.solux.sn';

/* Serveur distant pour test 
    https://apigs.solux.sn/api/
    `http://localhost:8000/api/`
    https://apigs.solux.sn/api/connexion
*/
