/* eslint-disable no-unused-vars */
import { Avatar, Box, Button, Grid, MenuItem, Paper, styled, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import api, { url } from 'utils/api';
import userImg from 'assets/images/avatar123.jpg';
import AuthUser from '../authentication/authentication3/AuthUser';
import { FormatIndentDecreaseSharp } from '@mui/icons-material';

const EditEntity = () => {
    const { id } = useParams();

    const [items, setItems] = useState();
    const [image, setImage] = useState();
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState();
    const navigate = useNavigate();
    const { user } = AuthUser();

    function handleInputChange(e) {
        const nameInput = e.target.name;
        if (nameInput === 'image') {
            const newImage = e.target?.files?.[0];
            const objectUrl = URL.createObjectURL(newImage);
            setImage(objectUrl);
            setImageFile(e.target?.files?.[0]);
        }
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
        setErrors({ ...errors, [name]: '' });
    }

    useEffect(() => {
        try {
            async function getData() {
                const response = await api.get('entreprise');
                const { data, status } = response.data;
                setItems({
                    nom_entreprise: data.nom_entreprise,
                    numero: data.numero,
                    couleur1: data.couleur1,
                    couleur2: data.couleur2,
                    couleur3: data.couleur3,
                    type: data.type
                });
                if (data.logo !== null) {
                    setImage(`${url}/entreprise-images/${data.logo}`);
                }
                setStatus(status);
                console.log(items);
            }
            getData();
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const HandleSubmit = () => {
        try {
            async function storeData() {
                let formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('id', id);
                formData.append('nom', items.nom_entreprise);
                formData.append('numero', items.numero);
                formData.append('couleur1', items.couleur1);
                formData.append('couleur2', items.couleur2);
                formData.append('couleur3', items.couleur3);
                formData.append('formule', items.type);
                formData.append('logo', imageFile);
                const response = await api.post('update-entreprise', formData);
                const { errors, status } = response.data;
                setStatus(status);

                if (errors) {
                    setErrors(errors);
                } else {
                    setErrors({});
                    const { message } = response.data;
                    console.log(message);
                    return navigate('/entity/index', { state: { alert: message } });
                }
            }
            storeData();
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
                <Item elevation={0}>Modifier Entreprise</Item>
            </Grid>
            {items && (
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
                                    Modifier Logo
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        type="file"
                                        name="image"
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
                            // noValidate
                            // autoComplete="off"
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
                                    error={errors?.nom_entreprise ? true : false}
                                    helperText={errors?.nom_entreprise}
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
                                    value={items.couleur1 || ''}
                                    type="color"
                                    error={errors?.couleur1 ? true : false}
                                    helperText={errors?.couleur1}
                                />
                                <TextField
                                    id="outlined"
                                    label="Couleur 2"
                                    name="couleur2"
                                    onChange={handleInputChange}
                                    value={items.couleur2 || ''}
                                    type="color"
                                    error={errors?.couleur2 ? true : false}
                                    helperText={errors?.couleur2}
                                />
                                <TextField
                                    id="outlined"
                                    label="Couleur 3"
                                    name="couleur3"
                                    onChange={handleInputChange}
                                    value={items.couleur3 || ''}
                                    type="color"
                                    required
                                    error={errors?.couleur3 ? true : false}
                                    helperText={errors?.couleur3}
                                />
                                <TextField
                                    id="outlined"
                                    select
                                    label="Formule"
                                    name="type"
                                    defaultValue={items.type === 'Pro' ? 'Pro' : 'Basic'}
                                    onChange={handleInputChange}
                                    type="select"
                                    required
                                    error={errors?.type ? true : false}
                                    helperText={errors?.type}
                                >
                                    <MenuItem value="Basic">Basic</MenuItem>
                                    <MenuItem value="Pro">Pro</MenuItem>
                                </TextField>
                                <Button
                                    variant="outlined"
                                    sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                    onClick={HandleSubmit}
                                >
                                    Modifier
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

export default EditEntity;
