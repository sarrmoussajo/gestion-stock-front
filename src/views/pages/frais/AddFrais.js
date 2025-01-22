/* eslint-disable no-unused-vars */
import { Button, FormControl, Grid, Paper, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import API from 'utils/api';
import AuthUser from '../authentication/authentication3/AuthUser';

const AddFrais = () => {
    const [status, setStatus] = useState(['']);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { user } = AuthUser();
    const [items, setItems] = useState({
        nom_frais: '',
        montant_frais: '',
        description: ''
    });
    const type_local = user?.profil === 'Caissier' ? 'Boutique' : 'Depot';
    const nom_local = user?.profil === 'Caissier' ? user['nom_boutique'] : user['nom_depot'];
    function handleInputChange(e) {
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
        setErrors({ ...errors, [name]: '' });
    }

    const HandleSubmit = () => {
        try {
            async function storeData() {
                const response = await API.post('frais', {
                    id: user.affectation,
                    nom_frais: items.nom_frais,
                    montant_frais: items.montant_frais,
                    description: items.description,
                    type_local: type_local,
                    nom_local: nom_local
                });
                const { status, error } = response.data;
                setStatus(status);
                if (status === 'failed') {
                    console.log(error);
                    setErrors(error);
                } else {
                    setErrors({});
                    const { message } = response.data;
                    return navigate('/frais/index', { state: { alert: message } });
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
                <Item elevation={0}>Ajouter Frais</Item>
            </Grid>
            <MainCard sx={{ minwidth: 100, ml: '20vw', mr: '20vw' }}>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1 }
                    }}
                    // noValidate
                    // autoComplete="off"
                    fullWidth
                >
                    <FormControl variant="filled" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <TextField
                            id="outlined"
                            label="intitulé frais"
                            name="nom_frais"
                            value={items.nom_frais}
                            onChange={handleInputChange}
                            type="text"
                            required
                            error={errors.nom_frais ? true : false}
                            helperText={errors.nom_frais}
                        />

                        <TextField
                            id="outlined"
                            label="Montant"
                            value={items.montant_frais}
                            name="montant_frais"
                            onChange={handleInputChange}
                            type="number"
                            required
                            error={errors.montant_frais ? true : false}
                            helperText={errors.montant_frais}
                        />
                        <TextField
                            id="outlined"
                            label="Description"
                            name="description"
                            onChange={handleInputChange}
                            value={items.description}
                            type="text"
                            error={errors.description ? true : false}
                            helperText={errors.description}
                        />
                        <Button variant="outlined" sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }} onClick={HandleSubmit}>
                            Enregistrer
                        </Button>
                    </FormControl>
                </Box>
            </MainCard>
        </>
    );
};
export default AddFrais;
