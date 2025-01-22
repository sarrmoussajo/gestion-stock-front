/* eslint-disable no-unused-vars */
import { Button, FormControl, Grid, Paper, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import API from 'utils/api';

const EditFrais = () => {
    const { id } = useParams();
    const [items, setItems] = useState({ nom_frais: '', date_frais: '', montant_frais: '', description: '' });
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
            async function getFrais() {
                const response = await API.get(`frais/${id}`);
                const { data, status } = response.data;
                setItems(data);
                setStatus(status);
            }
            getFrais();
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    const HandleUpdate = () => {
        try {
            async function updateData() {
                const response = await API.put(`frais/${id}`, {
                    nom_frais: items.nom_frais,
                    date_frais: items.date_frais,
                    montant_frais: items.montant_frais,
                    description: items.description,
                    type_local: items.type_local
                });
                const { status } = response.data;
                if (status == 'success') {
                    const { message } = response.data;
                    setItems({ nom_frais: '', date_frais: '', montant_frais: '', description: '' });
                    return navigate('/frais/index', { state: { alert: message } });
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

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.h2,
        textAlign: 'left',
        height: 60,
        lineHeight: '60px',
        marginBottom: 20,
        paddingLeft: 15
    }));

    const { nom_frais, date_frais, montant_frais, description } = items;
    return (
        <>
            <Grid item xs={8}>
                <Item elevation={0}>Modifier Frais</Item>
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
                            label="Nom Frais"
                            name="nom_frais"
                            value={nom_frais}
                            onChange={handleInputChange}
                            type="text"
                            error={errors.nom_frais ? true : false}
                            helperText={errors.nom_depot}
                        />
                        <TextField
                            id="outlined"
                            label="Montant"
                            name="montant_frais"
                            onChange={handleInputChange}
                            value={montant_frais}
                            type="number"
                            error={errors.montant_frais ? true : false}
                            helperText={errors.montant_frais}
                        />
                        <TextField
                            id="outlined"
                            label="Date"
                            value={date_frais}
                            name="date_frais"
                            onChange={handleInputChange}
                            type="date"
                            error={errors.date_frais ? true : false}
                            helperText={errors.date_frais}
                        />
                        <TextField
                            id="outlined"
                            label="Description"
                            name="description"
                            onChange={handleInputChange}
                            value={description || ''}
                            type="text"
                            error={errors.description ? true : false}
                            helperText={errors.description}
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

export default EditFrais;
