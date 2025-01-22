/* eslint-disable no-unused-vars */
import {
    Alert,
    Autocomplete,
    Button,
    CardActions,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    Link,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Box, display } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { ColorLens } from '@mui/icons-material';

const FaireVente = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        nom_article: '',
        boutique_id: 0,
        nom_boutique: '',
        quantite: 0,
        prix_vente: 0,
        montant_total: 0,
        article_id: 0,
        info_client: ''
    });
    const [addingArticle, setAddingArticle] = useState([]);
    const [errors, setErrors] = useState({});
    const { user } = AuthUser();
    const [prix, setPrix] = useState(false);
    const [prixTotalVente, setPrixTotalVente] = useState(0);

    /* const navigate = useNavigate();*/

    function handleInputChange(e) {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
        setErrors({});
        setMessage('');
    }

    const GetArticleID = () => {
        const article = items.find((item) => item.nom_article === formData.nom_article);
        if (article) {
            console.log(article);
            return article.article_id;
        }
        setErrors({ ...errors, message: 'Les informations renseignées ne sont pas disponibles' });
        return 0;
    };
    const HandleNext = () => {
        const article_id = GetArticleID();
        console.log(article_id);
        try {
            async function verifyArticleInDepot() {
                const response = await API.post(`verifier-quantite-boutique`, {
                    article_id: article_id,
                    boutique_id: user.affectation,
                    quantite: formData.quantite
                });
                const { status } = response.data;
                if (status == 'success') {
                    HandleAdd();
                } else {
                    const { message } = response.data;
                    setErrors({ ...errors, message: message });
                }
            }
            verifyArticleInDepot();
        } catch (error) {
            console.log(error);
        }
    };
    const deleteIndex = (index) => {
        const newItem = addingArticle?.filter((item) => item.article_id !== index);
        setAddingArticle(newItem);
    };

    const HandleAdd = () => {
        const article_id = GetArticleID();

        if (article_id !== 0) {
            const currentArticle = addingArticle.find((item) => item.nom_article === formData.nom_article);
            if (currentArticle) {
                const quantiteTotal = parseInt(currentArticle.quantite) + parseInt(formData.quantite);
                const filterCurrentArticle = addingArticle.filter((item) => item.nom_article !== formData.nom_article);
                setAddingArticle([
                    ...filterCurrentArticle,
                    {
                        ...formData,
                        quantite: quantiteTotal,
                        article_id: article_id,
                        montant_total: quantiteTotal * parseInt(currentArticle.prix_vente)
                    }
                ]);
            } else {
                setAddingArticle((items) => [
                    ...items,
                    {
                        ...formData,
                        article_id: article_id,
                        montant_total: parseInt(formData.quantite) * parseInt(formData.prix_vente)
                    }
                ]);
            }

            setFormData({ ...formData, nom_article: '', boutique_id: '', nom_boutique: '', quantite: 0, prix_vente: 0, montant_total: 0 });
            setPrix(false);
            setPrixTotalVente(prixTotalVente + parseInt(formData.quantite) * parseInt(formData.prix_vente));
            //setOpenForm(false);
        }
    };

    const HandleSubmit = () => {
        try {
            async function addVente() {
                if (addingArticle !== 0) {
                    const response = await API.post(`vente-articles`, {
                        articleEnVente: addingArticle,
                        boutique_id: user.affectation,
                        caissier_id: user.id
                    });
                    const { status } = response.data;
                    if (status == 'success') {
                        const { message } = response.data;
                        setAddingArticle([]);
                        setMessage(message);
                    } else {
                        const { errors } = response.data;
                        setErrors(errors);
                    }
                }
            }
            addVente();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        try {
            async function getArticles() {
                const response = await API.post(`articles-boutique`, {
                    boutique_id: user.affectation
                });
                const { data, status } = response.data;
                setItems(data);
            }

            getArticles();
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            if (formData.nom_article !== '') {
                const article = items.find((item) => item.nom_article === formData.nom_article);
                if (article) {
                    setFormData({ ...formData, prix_vente: article.prix_vente });
                    setPrix(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.nom_article]);

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
                <Item elevation={0}>Effectuer une Vente</Item>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    {message !== '' && (
                        <Alert
                            onClose={() => {
                                setMessage('');
                            }}
                        >
                            {message}
                        </Alert>
                    )}
                    <Grid container spacing={gridSpacing}>
                        {/* )} */}
                        <Grid item xs={12} md={4}>
                            <MainCard content={false}>
                                <CardContent>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12}>
                                            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <Grid item>
                                                    <Box
                                                        component="form"
                                                        sx={{
                                                            '& .MuiTextField-root': { m: 1 }
                                                        }}
                                                        fullWidth
                                                    >
                                                        <FormControl
                                                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                                                        >
                                                            <Autocomplete
                                                                freeSolo
                                                                inputvalue={formData.nom_article}
                                                                disableClearable
                                                                id="outlined"
                                                                options={items?.map((option) => option.nom_article)}
                                                                onChange={(event, value) =>
                                                                    setFormData({ ...formData, ['nom_article']: value })
                                                                }
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
                                                                    />
                                                                )}
                                                            />
                                                            <TextField
                                                                id="outlined"
                                                                label="quantité"
                                                                name="quantite"
                                                                value={formData.quantite || ''}
                                                                onChange={handleInputChange}
                                                                type="number"
                                                                required
                                                                error={errors.quantite ? true : false}
                                                                helperText={errors.quantite}
                                                            />
                                                            <TextField
                                                                id="outlined"
                                                                label="Info du Client"
                                                                name="info_client"
                                                                multiline
                                                                rows={3}
                                                                value={formData.info_client || ''}
                                                                onChange={handleInputChange}
                                                                type="text"
                                                                required
                                                                error={errors.info_client ? true : false}
                                                                helperText={errors.info_client}
                                                            />
                                                            {prix && (
                                                                <TextField
                                                                    disabled
                                                                    id="outlined"
                                                                    label="Prix"
                                                                    name="prix_vente"
                                                                    value={formData.prix_vente || ''}
                                                                    onChange={handleInputChange}
                                                                    type="number"
                                                                    required
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">F CFA</InputAdornment>
                                                                        )
                                                                    }}
                                                                />
                                                            )}

                                                            <Button
                                                                variant="outlined"
                                                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                onClick={HandleNext}
                                                                disabled={formData.quantite > 0 ? false : true}
                                                            >
                                                                Ajouter
                                                            </Button>
                                                        </FormControl>
                                                        <Typography color={'red'}>{errors && errors.message}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}></Grid>
                                    </Grid>
                                </CardContent>
                            </MainCard>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <MainCard>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nom Article</TableCell>
                                                    <TableCell>Client</TableCell>
                                                    <TableCell align="center">Quantité</TableCell>
                                                    <TableCell align="right">Prix unitaire</TableCell>
                                                    <TableCell align="center">Montant</TableCell>
                                                    <TableCell align="right">Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {addingArticle?.map((article) => (
                                                    <TableRow
                                                        key={article.article_id + article.botique_id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {article.nom_article}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {article.info_client}
                                                        </TableCell>
                                                        <TableCell align="right">{article.quantite}</TableCell>
                                                        <TableCell align="right">{article.prix_vente}</TableCell>
                                                        <TableCell align="right">{article.montant_total}</TableCell>
                                                        <TableCell align="right" color="red">
                                                            <Link
                                                                onClick={() => {
                                                                    deleteIndex(article.article_id);
                                                                }}
                                                            >
                                                                <DeleteIcon color="error"></DeleteIcon>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {addingArticle.length !== 0 && (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                    onClick={HandleSubmit}
                                                >
                                                    Vendre
                                                </Button>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        direction: 'row',
                                                        justifyContent: 'center',
                                                        mt: 2,
                                                        color: 'red',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Montant Total de la Vente: {prixTotalVente} F CFA
                                                </Box>
                                            </>
                                        )}
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default FaireVente;
