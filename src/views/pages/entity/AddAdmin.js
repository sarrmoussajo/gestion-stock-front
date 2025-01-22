/* eslint-disable no-unused-vars */
import { Avatar, Box, Button, Grid, MenuItem, Paper, styled, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/api';
import userImg from 'assets/images/avatar123.jpg';

const AddAdmin = () => {
    const [items, setItems] = useState({ nom: '', prenom: '', telephone: '', profil: '' });
    const [status, setStatus] = useState(['']);
    const [image, setImage] = useState();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    function handleInputChange(e) {
        const newImage = e.target?.files?.[0];
        if (newImage) {
            const objectUrl = URL.createObjectURL(newImage);
            setImage(objectUrl);
        }
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
        setErrors({ ...errors, [name]: '' });
    }

    const HandleSubmit = () => {
        try {
            async function storeData() {
                const response = await api.post('add-admin', items);
                const { error, status } = response.data;
                setStatus(status);

                if (status === 'failed') {
                    setErrors(error);
                } else {
                    setErrors({});
                    const { message } = response.data;
                    console.log(message);
                    return navigate('/entity/admin-index', { state: { alert: message } });
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
        color: '#024421',
        height: 60,
        lineHeight: '60px',
        marginBottom: 20,
        paddingLeft: 15
    }));

    return (
        <>
            <Grid item xs={8}>
                <Item elevation={0}>Ajouter Administrateur</Item>
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
                                ajouter photo
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
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
                                label="Nom"
                                name="nom"
                                onChange={handleInputChange}
                                value={items.nom}
                                type="text"
                                required
                                error={errors.nom ? true : false}
                                helperText={errors.nom}
                            />
                            <TextField
                                id="outlined"
                                label="Prénom"
                                name="prenom"
                                onChange={handleInputChange}
                                value={items.prenom}
                                type="text"
                                required
                                error={errors.prenom ? true : false}
                                helperText={errors.prenom}
                            />
                            <TextField
                                id="outlined"
                                label="Téléphone"
                                name="telephone"
                                onChange={handleInputChange}
                                value={items.telephone}
                                type="number"
                                required
                                error={errors.telephone ? true : false}
                                helperText={errors.telephone}
                            />

                            <Button
                                variant="outlined"
                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                onClick={HandleSubmit}
                            >
                                Enregistrer
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </MainCard>
        </>
    );
};

export default AddAdmin;
