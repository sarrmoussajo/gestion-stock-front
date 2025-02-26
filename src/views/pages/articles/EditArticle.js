/* eslint-disable no-unused-vars */
import { Category } from '@mui/icons-material';
import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import API from 'utils/api';
import AuthUser from 'views/pages/authentication/authentication3/AuthUser';

const EditArticle = () => {
    const { id } = useParams();
    const [items, setItems] = useState({ nom_article: '', quantite_depot: '', marque: '', reference: '', prix: '', type: '', categorie: '', id_categorie: '' });
    const [status, setStatus] = useState(['']);
    const [errors, setErrors] = useState({});
    const [isEnabled, setEnabled] = useState(false);
    const navigate = useNavigate();
    const { user } = AuthUser();
    const [message, setMessage] = useState({ text: '', color: '' });
    const [itemsCategorie, setItemsCategorie] = useState([]);
    const [idCategorieAnc, setIdCategorieAnc] = useState('');

    function handleInputChange(e) {
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setEnabled(true);
    }

    async function getArticle() {
        try {
            const response = await API.post(`article-depot`, {
                gerant_id: user.id,
                depot_id: user.affectation,
                article_id: id
            });
            const { data, status } = response.data;
            setItems(data);
            setItems({ ...data, ['id_categorie']: data.id });
            setIdCategorieAnc(data.id);
            setStatus(status);
        } catch (error) {
            console.log(error);
        }
    }

    async function getCategories() {
        try {
            const response = await API.get(`article/category`);
            const { data, status } = response.data;
            setItemsCategorie(data);
        } catch (error) {
            navigate('/dashboard/gerant', { replace: true });
            setMessage({ text: "Erreur lors de la récupération des categories", color: 'error' });
            console.log(error);
        }

    }

    function findIdCategorie(category) {
        const categorieSelected = itemsCategorie.find(cat => cat.categorie === category);
        if (categorieSelected !== null) {
            setItems({ ...items, ['id_categorie']: categorieSelected.id, ['categorie']: categorieSelected.categorie });
        }
        else {
            setItems({ ...items, ['categorie']: category });
        }
    }

    useEffect(() => {
        try {
            getCategories();
        } catch (error) {
            console.log(error);
        }
    }, [items]);

    async function updateArticle() {
        try {

            if (quantite_depot === '' || quantite_depot === 0) {
                setErrors({ quantite_depot: 'La quantité est requise et doit etre différente de 0' });
                return;
            }
            const response = await API.put(`article`, {
                gerant_id: user.id,
                depot_id: user.affectation,
                article_id: id,
                nom_article: items.nom_article,
                quantite: quantite_depot,
                marque: items.marque,
                reference: items.reference,
                type: items.type,
                id_categorie: items.id_categorie,
                id_categorie_anc: idCategorieAnc,
                categorie: items.categorie,
                prix: items.prix
            });
            const { status, errors } = response.data;
            if (status === 'success') {
                const { message } = response.data;
                return navigate('/depot/article', { state: { alert: message, cat: items.categorie } });
            } else {
                const { errors } = response.data;
                setErrors(errors);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        try {
            getArticle();

        } catch (error) {
            console.log(error);
        }
    }, [id, user]);

    const HandleUpdate = () => {
        try {
            updateArticle();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'article :", error);
        }
    };

    const { nom_article, quantite_depot, marque, reference, prix, categorie, type } = items;

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
                <Item elevation={0}>Modifier Article</Item>
            </Grid>
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
            <MainCard sx={{ minwidth: 100, ml: '20vw', mr: '20vw' }}>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1 }
                    }}
                    fullWidth
                >
                    <FormControl style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <TextField
                            id="outlined"
                            label="Nom Article"
                            name="nom_article"
                            value={nom_article || ''}
                            onChange={handleInputChange}
                            type="text"
                            error={errors?.nom_article ? true : false}
                            helperText={errors?.nom_article}
                        />
                        <TextField
                            id="outlined"
                            label="reference"
                            name="reference"
                            onChange={handleInputChange}
                            value={reference || ''}
                            type="text"
                            error={errors?.reference ? true : false}
                            helperText={errors?.reference}
                        />

                        <TextField
                            id="outlined"
                            label="Marque"
                            name="marque"
                            onChange={handleInputChange}
                            value={marque || ''}
                            type="text"
                            error={errors?.marque ? true : false}
                            helperText={errors?.marque}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-multiple-name-label">Type</InputLabel>
                            <Select labelId="demo-multiple-name-label"
                                id="demo-multiple-name" name="type" value={type || ''} onChange={handleInputChange} required>
                                <MenuItem value="Luminaires">Luminaires</MenuItem>
                                <MenuItem value="Appareillages">Appareillages</MenuItem>
                                <MenuItem value="Solaires">Solaires</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            freeSolo
                            value={categorie} // Assurez-vous que article est bien défini
                            id="outlined"

                            options={[...new Set(itemsCategorie?.map((option) =>
                                option.categorie
                            ))]} // Evite erreurs si itemsCategorie est null
                            onChange={(event, value) => {
                                findIdCategorie(value);
                                setEnabled(true);
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
                            label="Quantité"
                            name="quantite_depot"
                            onChange={handleInputChange}
                            value={quantite_depot || ''}
                            type="number"
                            error={errors?.quantite_depot ? true : false}
                            helperText={errors?.quantite_depot}
                        />
                        <TextField
                            id="outlined"
                            label="Prix"
                            name="prix"
                            onChange={handleInputChange}
                            value={prix || ''}
                            type="text"
                            error={errors?.prix ? true : false}
                            helperText={errors?.prix}
                        />
                        <Button
                            variant="outlined"
                            sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                            onClick={HandleUpdate}
                            disabled={isEnabled ? false : true}
                        >
                            Modifier
                        </Button>
                    </FormControl>
                </Box>
            </MainCard>
        </>
    );
};

export default EditArticle;
