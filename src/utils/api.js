import axios from 'axios';

export default axios.create({
    baseURL: `http://localhost:8000/api/`
});

export const url = 'http://localhost:8000/';

/* Serveur distant pour test 
    https://apigs.solux.sn/api/
    `http://localhost:8000/api/`
    https://apigs.solux.sn/api/connexion
*/
