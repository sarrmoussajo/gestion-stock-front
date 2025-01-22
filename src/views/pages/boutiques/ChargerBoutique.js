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
import { Box } from '@mui/system';
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

const ChargerBoutique = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState();
    const [itemsBoutiques, setItemsBoutiques] = useState();
    const [price, setPrice] = useState(0);
    const [formData, setFormData] = useState({
        nom_article: '',
        boutique_id: 0,
        nom_boutique: '',
        quantite: 0,
        prix_vente: 0,
        tva: false,
        user_id: 0
    });
    const [addingArticle, setAddingArticle] = useState([]);
    const [errors, setErrors] = useState({});
    const { user } = AuthUser();
    const [spinner, setSpinner] = useState(true);

    /* const navigate = useNavigate();*/

    function handleInputChange(e) {
        const { name, value } = e.target;
        if (name === 'tva') {
            setFormData({ ...formData, [name]: !formData.tva });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    const GetBoutiqueID = () => {
        const boutique = itemsBoutiques.find((item) => item.nom_boutique === formData.nom_boutique);
        return boutique.id;
    };

    const GetArticle = () => {
        const article = items.find((item) => item.nom_article === formData.nom_article);
        return article;
    };
    const HandleNext = () => {
        const articleChecked = GetArticle();
        const article_id = articleChecked.id;
        try {
            async function verifyArticleInDepot() {
                const response = await API.post(`verifier-quantite`, {
                    article_id: article_id,
                    depot_id: user.affectation,
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

    const HandleAdd = () => {
        const articleChecked = GetArticle();
        const article_id = articleChecked.id;
        const prix_vente = articleChecked.prix;
        const boutique_id = GetBoutiqueID();
        const currentArticle = addingArticle.find(
            (item) => item.nom_article === formData.nom_article && item.nom_boutique === formData.nom_boutique
        );
        if (currentArticle) {
            const filterCurrentArticle = addingArticle.filter(
                (item) => item.nom_article !== formData.nom_article && item.nom_boutique !== formData.nom_boutique
            );
            setAddingArticle([
                ...filterCurrentArticle,
                {
                    ...formData,
                    quantite: parseInt(currentArticle.quantite) + parseInt(formData.quantite),
                    tva: formData.tva,
                    boutique_id: boutique_id,
                    id: article_id,
                    user_id: user.id,
                    prix_vente: prix_vente
                }
            ]);
        } else {
            setAddingArticle((items) => [
                ...items,
                { ...formData, boutique_id: boutique_id, id: article_id, user_id: user.id, prix_vente: prix_vente }
            ]);
        }
        setFormData({ ...formData, nom_article: '', boutique_id: '', nom_boutique: '', quantite: 0, prix_vente: 0, tva: false });
    };

    const HandleSubmit = () => {
        try {
            async function addArticleBoutique() {
                if (addingArticle !== 0) {
                    const response = await API.post(`transferer-article`, {
                        articleBoutique: addingArticle,
                        depot_id: user.affectation
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
            addArticleBoutique();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        try {
            async function getArticles() {
                const response = await API.get(`articles`);
                const { data, status } = response.data;
                setItems(data);
                //setStatus(status);
            }
            async function getBoutiques() {
                const response = await API.get(`boutique`);
                const { data, status } = response.data;
                setItemsBoutiques(data);
            }
            getArticles();
            getBoutiques();
            setSpinner(false);
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
                <Item elevation={0}>Transférer Article vers un Showroom</Item>
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
                                                                inputValue={formData.nom_boutique}
                                                                disableClearable
                                                                id="outlined"
                                                                options={
                                                                    itemsBoutiques
                                                                        ? itemsBoutiques &&
                                                                          itemsBoutiques?.map((option) => option.nom_boutique)
                                                                        : []
                                                                }
                                                                onChange={(event, value) =>
                                                                    setFormData({ ...formData, ['nom_boutique']: value })
                                                                }
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Nom Boutique"
                                                                        name="nom_boutique"
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                            type: 'search'
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <Autocomplete
                                                                freeSolo
                                                                inputValue={formData.nom_article}
                                                                disableClearable
                                                                id="outlined"
                                                                options={items ? items && items.map((option) => option.nom_article) : []}
                                                                onChange={(event, value) => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        ['nom_article']: value
                                                                    });
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
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formData.tva}
                                                                        onChange={handleInputChange}
                                                                        name="tva"
                                                                    />
                                                                }
                                                                label="Appliquer TVA"
                                                            />

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
                                                    <TableCell align="center">Nom Boutique</TableCell>
                                                    <TableCell align="right">Quantité à transférer</TableCell>
                                                    <TableCell align="center">Prix Unitaire</TableCell>
                                                    <TableCell align="right">Tva</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {addingArticle &&
                                                    addingArticle.map((article) => (
                                                        <TableRow
                                                            key={article.id + article.boutique_id + article.nom_article}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {article.nom_article}
                                                            </TableCell>
                                                            <TableCell align="center">{article.nom_boutique}</TableCell>
                                                            <TableCell align="right">{article.quantite}</TableCell>
                                                            <TableCell align="right">{article.prix_vente}</TableCell>
                                                            <TableCell align="right">{article.tva ? 'oui' : 'non'}</TableCell>
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
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default ChargerBoutique;
