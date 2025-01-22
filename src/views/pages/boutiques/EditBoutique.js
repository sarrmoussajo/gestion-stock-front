/* eslint-disable no-unused-vars */
import { Button, FormControl, Grid, Paper, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import API from 'utils/api';

const EditBoutique = () => {
    const { id } = useParams();
    const [items, setItems] = useState({ nom_boutique: '', adresse: '', telephone: '', email: '' });
    const [status, setStatus] = useState(['']);
    const [errors, setErrors] = useState({});
    const [isEnabled, setEnabled] = useState(false);
    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setEnabled(true);
    }

    useEffect(() => {
        try {
            async function getDepot() {
                const response = await API.get(`boutique/${id}`);
                const { data, status } = response;
                setItems(data);
                console.log(status);
                setStatus(status);
            }
            getDepot();
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    const HandleUpdate = () => {
        try {
            async function updateData() {
                const response = await API.put(`boutique/${id}`, {
                    nom_boutique: items.nom_boutique,
                    adresse: items.adresse,
                    telephone: items.telephone,
                    email: items.email
                });
                const { status } = response.data;
                if (status == 'success') {
                    const { message } = response.data;
                    setItems({ nom_boutique: '', adresse: '', telephone: '', email: '' });
                    return navigate('/boutique/index', { state: { alert: message } });
                } else {
                    const { error } = response.data;
                    setErrors(error);
                }
            }
            updateData();
        } catch (error) {
            console.log(error);
        }
    };

    const { nom_boutique, adresse, telephone, email } = items;
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
                <Item elevation={0}>Modifier Les Infos du Showroom : {nom_boutique || ''}</Item>
            </Grid>
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
                            label="Nom Boutique"
                            name="nom_boutique"
                            value={nom_boutique || ''}
                            onChange={handleInputChange}
                            type="text"
                            error={errors.nom_boutique ? true : false}
                            helperText={errors.nom_boutique}
                        />
                        <TextField
                            id="outlined"
                            label="Adresse"
                            name="adresse"
                            onChange={handleInputChange}
                            value={adresse || ''}
                            type="text"
                            error={errors.adresse ? true : false}
                            helperText={errors.adresse}
                        />
                        <TextField
                            id="outlined"
                            label="Téléphone"
                            value={telephone || ''}
                            name="telephone"
                            onChange={handleInputChange}
                            type="number"
                            error={errors.telephone ? true : false}
                            helperText={errors.telephone}
                        />
                        <TextField
                            id="outlined"
                            label="email"
                            name="email"
                            onChange={handleInputChange}
                            value={email || ''}
                            type="email"
                            error={errors.email ? true : false}
                            helperText={errors.email}
                        />
                        <Button
                            variant="outlined"
                            sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                            onClick={HandleUpdate}
                            disabled={isEnabled ? false : true}
                        >
                            Enregistrer
                        </Button>
                    </FormControl>
                </Box>
            </MainCard>
        </>
    );
};

export default EditBoutique;
