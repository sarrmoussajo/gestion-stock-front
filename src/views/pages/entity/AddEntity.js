/* eslint-disable no-unused-vars */
import { Avatar, Box, Button, FormHelperText, Grid, MenuItem, Paper, styled, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/api';
import userImg from 'assets/images/avatar123.jpg';

const AddEntity = () => {
    const [items, setItems] = useState({
        nom_entreprise: '',
        numero: '',
        couleur1: '',
        couleur2: '',
        couleur3: '',
        formule: ''
    });
    const [image, setImage] = useState();
    const [errors, setErrors] = useState({
        nom: '',
        numero: '',
        formule: '',
        message: ''
    });
    const [fileImage, setFileImage] = useState();
    const navigate = useNavigate();

    function handleInputChange(e) {
        let newImage;
        if (e.target.name === 'logo') {
            newImage = e.target?.files?.[0];
            const objectUrl = URL.createObjectURL(newImage);
            setFileImage(e.target?.files?.[0]);
            // api.post('add-entreprise', formData).then((res) => {
            //     console.log(res);
            // });
            setImage(objectUrl);
        } else {
            const { name, value } = e.target;
            setItems({ ...items, [name]: value });
            setErrors({});
        }
    }

    const HandleSubmit = () => {
        try {
            async function storeData() {
                let formData = new FormData();
                formData.append('logo', fileImage);
                formData.append('nom', items.nom_entreprise);
                formData.append('numero', items.numero);
                formData.append('couleur1', items.couleur1);
                formData.append('couleur2', items.couleur2);
                formData.append('couleur3', items.couleur3);
                formData.append('formule', items.formule);
                formData.append('Content-Type', 'multipart/form-data');
                const response = await api.post('add-entreprise', formData);
                const { status, error, message } = response.data;
                if (message) {
                    setErrors({ message: message });
                } else if (status !== 'success') {
                    setErrors(error);
                } else {
                    return navigate('/entity/index', { state: { alert: message } });
                }
            }
            if (fileImage) {
                storeData();
            } else {
                setErrors({ message: 'veuillez insérer un logo ou une image de votre entreprise' });
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                <Item elevation={0}>Ajouter Entreprise</Item>
            </Grid>
            <MainCard sx={{ minwidth: 100, ml: '10vw', mr: '10vw' }}>
                <Box display="flex" flexDirection="row" justifyContent="space-evenly" alignItems="flex-start">
                    <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {image ? (
                            <Avatar src={image} sx={{ width: 200, height: 200 }} />
                        ) : (
                            <Avatar src={userImg} sx={{ width: 200, height: 200 }} />
                        )}
                        <label htmlFor="raised-button-file" style={{ alignSelf: 'center' }}>
                            <Button component="span">
                                ajouter Logo
                                <input
                                    //accept="image/*"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    name="logo"
                                    onChange={handleInputChange}
                                />
                            </Button>
                        </label>
                    </Box>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1 }
                        }}
                        fullWidth
                    >
                        <Box
                            variant="filled"
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '30vw ' }}
                        >
                            <TextField
                                id="outlined"
                                label="Nom Entreprise"
                                name="nom_entreprise"
                                onChange={handleInputChange}
                                value={items.nom_entreprise}
                                type="text"
                                required
                                error={errors?.nom ? true : false}
                                helperText={errors?.nom}
                            />
                            <TextField
                                id="outlined"
                                label="Numéro"
                                name="numero"
                                onChange={handleInputChange}
                                value={items.numero}
                                type="text"
                                required
                                error={errors?.numero ? true : false}
                                helperText={errors?.numero}
                            />
                            <TextField
                                id="outlined"
                                label="Couleur 1"
                                name="couleur1"
                                onChange={handleInputChange}
                                value={items.couleur1}
                                type="color"
                                error={errors?.couleur1 ? true : false}
                                helperText={errors?.couleur1}
                            />
                            <TextField
                                id="outlined"
                                label="Couleur 2"
                                name="couleur2"
                                onChange={handleInputChange}
                                value={items.couleur2}
                                type="color"
                                error={errors?.couleur2 ? true : false}
                                helperText={errors?.couleur2}
                            />
                            <TextField
                                id="outlined"
                                label="Couleur 3"
                                name="couleur3"
                                onChange={handleInputChange}
                                value={items.couleur3}
                                type="color"
                                required
                                error={errors?.couleur3 ? true : false}
                                helperText={errors?.couleur3}
                            />
                            <TextField
                                id="outlined"
                                select
                                label="Formule"
                                name="formule"
                                defaultValue="choose"
                                onChange={handleInputChange}
                                type="select"
                                required
                                error={errors?.formule ? true : false}
                                helperText={errors?.formule}
                            >
                                <MenuItem disabled value="choose">
                                    Choisir un Formule d'Abonnement
                                </MenuItem>
                                <MenuItem value="Basic">Basic</MenuItem>
                                <MenuItem value="Pro">Pro</MenuItem>
                            </TextField>
                            <Button
                                variant="outlined"
                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                onClick={HandleSubmit}
                            >
                                Enregistrer
                            </Button>
                            <Box sx={{ mt: 3, display: 'flex', direction: 'row', justifyContent: 'center' }}>
                                <FormHelperText error>{errors?.message}</FormHelperText>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </MainCard>
        </>
    );
};

export default AddEntity;
