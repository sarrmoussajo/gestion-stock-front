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

const SolderPrix = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        nom_article: '',
        prix_vente: 0,
        article_id: 0,
        prix_solde: 0,
        date_fin_solde: Date.now()
    });
    const [errors, setErrors] = useState({});
    const { user } = AuthUser();
    const [prix, setPrix] = useState(false);

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
            return article.id;
        }
        setErrors({ ...errors, message: 'Les informations renseignées ne sont pas disponibles' });
        return 0;
    };
    const HandleSubmit = () => {
        try {
            const article_id = GetArticleID();
            if (article_id) {
                solderPrix();
            }
            async function solderPrix() {
                const response = await API.post(`solder-article`, {
                    article_id: article_id,
                    boutique_id: user.affectation,
                    prix_vente: formData.prix_solde,
                    date_fin_solde: formData.date_fin_solde
                });
                const { status } = response.data;
                if (status == 'success') {
                    const { message } = response.data;
                    setFormData({
                        nom_article: '',
                        prix_vente: 0,
                        article_id: 0,
                        prix_solde: 0
                    });
                    setMessage(message);
                } else {
                    const { errors } = response.data;
                    setErrors(errors);
                    console.log(errors);
                }
            }
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
                <Item elevation={0}>Solder le prix d'une article</Item>
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
                        <Grid item xs={12} md={4}></Grid>
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
                                                            {prix && (
                                                                <TextField
                                                                    disabled
                                                                    id="outlined"
                                                                    label="Prix Actuel"
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
                                                            <TextField
                                                                id="outlined"
                                                                label="Prix Soldé"
                                                                name="prix_solde"
                                                                value={formData.prix_solde || ''}
                                                                onChange={handleInputChange}
                                                                type="number"
                                                                required
                                                                InputProps={{
                                                                    startAdornment: <InputAdornment position="start">F CFA</InputAdornment>
                                                                }}
                                                            />
                                                            {prix && (
                                                                <TextField
                                                                    id="outlined"
                                                                    label="Date de fin"
                                                                    value={formData.date_fin_solde || ''}
                                                                    name="date_fin_solde"
                                                                    onChange={handleInputChange}
                                                                    type="date"
                                                                    required
                                                                    error={errors?.date_fin_solde}
                                                                    helperText={errors?.date_fin_solde}
                                                                />
                                                            )}
                                                            <Button
                                                                variant="outlined"
                                                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                onClick={HandleSubmit}
                                                                disabled={formData.prix_solde > 0 ? false : true}
                                                            >
                                                                Solder
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
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default SolderPrix;
