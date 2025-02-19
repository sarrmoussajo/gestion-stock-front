/* eslint-disable no-unused-vars */
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Button,
    CardActions,
    CardContent,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, color } from '@mui/system';
import { useEffect } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import API from 'utils/api';
import EarningCard from 'views/dashboard/Default/EarningCard';
import PopularCard from 'views/dashboard/Default/PopularCard';
import TotalGrowthBarChart from 'views/dashboard/Default/TotalGrowthBarChart';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import TotalIncomeLightCard from 'views/dashboard/Default/TotalIncomeLightCard';
import TotalOrderLineChartCard from 'views/dashboard/Default/TotalOrderLineChartCard';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import AuthUser from '../authentication/authentication3/AuthUser';
import { useNavigate } from "react-router-dom";
import { set } from 'date-fns';

const ChargerDepot = () => {
    const [message, setMessage] = useState({ text: '', color: '' });
    const [errorsValidation, seterrorsValidation] = useState({});
    const [items, setItems] = useState();
    const [article, setArticle] = useState({ nom_article: '', code: '', id: '', quantite: 0, marque: '', reference: '', prix: 0, categorie: '' });
    const [addingArticle, setAddingArticle] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    /*const [status, setStatus] = useState(['']);*/
    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [itemsCategorie, setItemsCategorie] = useState([]);
    const { user, getToken } = AuthUser();
    const navigate = useNavigate();

    /* const navigate = useNavigate();*/

    function handleInputChange(e) {
        const { name, value } = e.target;

        setArticle({ ...article, [name]: value });
        setErrors({ ...errors, [name]: '' });

        // setEnabled(true);
    }
    function deleteArticle(nom_article) {
        setAddingArticle(addingArticle.filter((item) => item.nom_article !== nom_article));
    }
    /*
    const HandleSubmit = () => {
        try {
            async function storeData() {
                const response = await API.post('depot', items);
                const { errors, status } = response.data;
                setStatus(status);

                if (errors) {
                    setErrors(errors);
                } else {
                    setErrors({});
                    const { message } = response.data;
                    //return navigate('/depot/index');
                    return navigate('/depot/index', { state: { alert: message } });
                }
            }
            storeData();
        } catch (error) {
            console.log(error);
        }
    };*/
    const HandleNext = () => {
        const currentArticleSaved = items.find((item) => item.nom_article === article.nom_article);
        let val = false;
        if (currentArticleSaved) {
            setArticle(currentArticleSaved);
            val = true;
        }
        // else {
        //     const newArticle = HandleAddNewArticle();
        // }
        setOpenForm(true);
        return val;
    };

    async function HandleAdd() {
        if (items.find((item) => item.code === article.code)) {
            const currentArticleSaved = addingArticle.find((item) => item.nom_article === article.nom_article);
            if (currentArticleSaved) {
                const filterCurrentArticle = addingArticle.filter((item) => item.nom_article !== article.nom_article);

                setAddingArticle([
                    ...filterCurrentArticle,
                    {
                        ...article,
                        quantite: parseInt(currentArticleSaved.quantite) + parseInt(article.quantite)
                    }
                ]);
            } else {
                setAddingArticle((items) => [...items, article]);
            }
            setOpenForm(false);
        } else {
            const newArticle = HandleAddNewArticle();
        }
    }

    const HandleAddNewArticle = () => {
        console.log('article', article);
        const newArticle = article.nom_article;
        const marque = article.marque;
        const reference = article.reference;
        const quantite = article.quantite;
        const type = article.type;
        const prix = article.prix;
        const categorie = article.categorie;
        const code = article.code;
        try {
            async function storeArticle() {

                const response = await API.post('ajouter-un-article', {
                    nom_article: newArticle,
                    marque: marque,
                    reference: reference,
                    categorie: categorie,
                    type: type,
                    prix: prix,
                    code: code
                });
                const { article, status, message } = response.data;
                if (status === 'success') {
                    const articleSaved = article;

                    setAddingArticle((items) => [
                        ...items,
                        {
                            ...article,
                            nom_article: articleSaved.nom_article,
                            code: articleSaved.code,
                            id: articleSaved.id,
                            marque: articleSaved.marque,
                            reference: articleSaved.reference,
                            type: articleSaved.type,
                            categorie: articleSaved.categorie,
                            quantite: quantite,
                            prix: prix
                        }
                    ]);
                    setArticle({
                        nom_article: '',
                        code: '',
                        id: '',
                        quantite: 0,
                        marque: '',
                        reference: '',
                        type: '',
                        categorie: '',
                        prix: 0
                    });
                    setOpenForm(false);
                } else {
                    seterrorsValidation(message);
                    setOpenForm(true);
                }
            }
            storeArticle();
        } catch (error) {
            setMessage({ text: 'Erreur lors de l\'ajout de l\'article', color: 'error' });
            console.log(error);
        }
    };

    const HandleSubmit = () => {
        try {
            async function addArticleDepot() {
                if (addingArticle !== 0) {
                    const response = await API.post(`ajouter-article`, {
                        articleDepot: addingArticle,
                        depot_id: user.affectation
                    });

                    const { status } = response.data;
                    if (status == 'success') {
                        const { message } = response.data;
                        setAddingArticle([]);
                        setArticle({ nom_article: '', code: '', id: '', quantite: 0, marque: '', reference: '' });
                        setOpenForm(false);
                        setMessage(({ text: message, color: 'success' }));
                    } else {
                        const { errors } = response.data;
                        setErrors(errors);

                    }
                }
            }
            addArticleDepot();
        } catch (error) {

            setMessage({ text: "Erreur lors de l'ajout de l'article", color: 'error' });
            console.log(error);

        }
    };

    async function getArticles() {
        try {
            const response = await API.get(`articles`);
            const { data, status } = response.data;
            setItems(data);
            //setStatus(status); 
        } catch (error) {
            console.log(error);

        }

    }

    async function getCategories() {
        try {
            const response = await API.get(`article/category`);
            const { data, status } = response.data;

            console.log('itemsCategorie', status);
            setItemsCategorie(data);
            //setStatus(status); 
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        try {
            getArticles();
            console.log('user', user);
        } catch (error) {
            console.log(error);
        }
    }, [addingArticle]);


    useEffect(() => {
        try {
            getCategories();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.h2,
        textAlign: 'left',
        height: 60,
        lineHeight: '60px',
        marginBottom: 20,
        paddingLeft: 15
    }));

    return (
        <>
            <Grid item xs={8}>
                <Item elevation={0}>Approvisionner le Stock</Item>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    {message.color !== '' && (
                        <Alert
                            severity={message.color}
                            onClose={() => {
                                setMessage({ text: '', color: '' });
                            }}
                        >
                            {message.text}
                        </Alert>
                    )}

                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={4}>
                            <MainCard content={false}>
                                <CardContent>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={12}>
                                            <Grid item>
                                                <Box
                                                    component="form"
                                                    sx={{
                                                        '& .MuiTextField-root': { m: 1 },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 2 // Espacement uniforme
                                                    }}
                                                    fullWidth
                                                >
                                                    <FormControl
                                                        fullWidth
                                                    >
                                                        <Autocomplete
                                                            freeSolo
                                                            inputValue={article.nom_article || ''}
                                                            disableClearable
                                                            id="outlined"
                                                            options={[...new Set(items?.map((option) => option.nom_article))]}
                                                            onChange={(event, value) => {
                                                                setArticle({ ...article, ['nom_article']: value });
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Nom Article"
                                                                    name="nom_article"
                                                                    onChange={handleInputChange}
                                                                    required
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        type: 'search'
                                                                    }}
                                                                    fullWidth
                                                                />
                                                            )}
                                                        />

                                                        {!openForm ? (
                                                            <>
                                                                <Button
                                                                    variant="outlined"
                                                                    sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                    onClick={HandleNext}
                                                                    disabled={article.nom_article === '' ? true : false}
                                                                >
                                                                    Suivant
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TextField
                                                                    id="outlined"
                                                                    label="code"
                                                                    name="code"
                                                                    value={article.code || ''}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    required
                                                                    error={errors.code ? true : false}
                                                                    helperText={errors.code}
                                                                    fullWidth
                                                                />
                                                                <TextField
                                                                    id="outlined"
                                                                    label="reference"
                                                                    name="reference"
                                                                    value={article.reference || ''}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    required
                                                                    error={errorsValidation.reference ? true : false}
                                                                    helperText={errorsValidation.reference}
                                                                    fullWidth
                                                                />
                                                                <TextField
                                                                    id="outlined"
                                                                    label="marque"
                                                                    name="marque"
                                                                    value={article.marque || ''}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    required
                                                                    error={errorsValidation.marque ? true : false}
                                                                    helperText={errorsValidation.marque}
                                                                    fullWidth
                                                                />
                                                                {/* Sélecteur pour le type */}
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="demo-multiple-name-label">Type</InputLabel>
                                                                    <Select labelId="demo-multiple-name-label"
                                                                        id="demo-multiple-name" name="type" value={article.type || ''} onChange={handleInputChange} required>
                                                                        <MenuItem value="Luminaires">Luminaires</MenuItem>
                                                                        <MenuItem value="Appareillages">Appareillages</MenuItem>
                                                                        <MenuItem value="Solaires">Solaires</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                                <Autocomplete
                                                                    freeSolo
                                                                    value={article.categorie} // Assurez-vous que article est bien défini
                                                                    id="outlined"

                                                                    options={[...new Set(itemsCategorie?.map((option) => option.categorie))]} // Evite erreurs si itemsCategorie est null
                                                                    onChange={(event, value) => {
                                                                        setArticle({ ...article, ["categorie"]: value }); // Mise à jour correcte de l'objet
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Catégorie"
                                                                            name="categorie"
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            InputProps={{
                                                                                ...params.InputProps,
                                                                                type: 'search'
                                                                            }}
                                                                            fullWidth
                                                                        />
                                                                    )}
                                                                />
                                                                <TextField
                                                                    id="outlined"
                                                                    label="quantité"
                                                                    name="quantite"
                                                                    value={article.quantite || ''}
                                                                    onChange={handleInputChange}
                                                                    type="number"
                                                                    required
                                                                    error={errors.quantite ? true : false}
                                                                    helperText={errors.quantite}
                                                                    fullWidth
                                                                />
                                                                <TextField
                                                                    id="outlined"
                                                                    label="prix en CFA"
                                                                    name="prix"
                                                                    value={article.prix || ''}
                                                                    onChange={handleInputChange}
                                                                    type="number"
                                                                    required
                                                                    error={errors.prix ? true : false}
                                                                    helperText={errors.prix}
                                                                    fullWidth
                                                                />
                                                                <Button
                                                                    variant="outlined"
                                                                    sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                    onClick={HandleAdd}
                                                                    disabled={article.quantite > 0 ? false : true}
                                                                >
                                                                    Ajouter
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                    onClick={() => {
                                                                        setOpenForm(false);
                                                                        setArticle({
                                                                            nom_article: '',
                                                                            code: '',
                                                                            id: '',
                                                                            quantite: 0,
                                                                            prix: 0
                                                                        });
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </Button>
                                                            </>
                                                        )}
                                                    </FormControl>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}></Grid>

                                </CardContent>
                            </MainCard>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <MainCard>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nom Article</TableCell>
                                                    <TableCell align="center">Code article</TableCell>
                                                    <TableCell align="right">marque</TableCell>
                                                    <TableCell align="right">reference</TableCell>
                                                    <TableCell align="right">Quantité</TableCell>
                                                    <TableCell align="right">Prix</TableCell>
                                                    <TableCell align="right"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {addingArticle &&
                                                    addingArticle.map((article) => (
                                                        <TableRow
                                                            key={article.nom_article}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {article.nom_article}
                                                            </TableCell>
                                                            <TableCell align="center">{article.code}</TableCell>
                                                            <TableCell align="center">{article.marque}</TableCell>
                                                            <TableCell align="center">{article.reference}</TableCell>
                                                            <TableCell align="right">{article.quantite}</TableCell>
                                                            <TableCell align="right">{article.prix}</TableCell>
                                                            <TableCell align="right">
                                                                <DeleteIcon
                                                                    sx={{ color: 'red' }}
                                                                    onClick={() => {
                                                                        deleteArticle(article.nom_article);
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                        {addingArticle.length !== 0 && (
                                            <Button
                                                variant="outlined"
                                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                onClick={HandleSubmit}
                                            >
                                                Enregistrer
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Grid>
                    </Grid >
                </Grid >
            </Grid >
        </>
    );
};

export default ChargerDepot;
