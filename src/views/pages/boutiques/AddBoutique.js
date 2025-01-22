/* eslint-disable no-unused-vars */
import { Button, FormControl, Grid, Paper, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import API from 'utils/api';

const AddBoutique = () => {
    const [items, setItems] = useState({ nom_boutique: '', adresse: '', telephone: '', email: '' });
    const [status, setStatus] = useState(['']);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
        setErrors({ ...errors, [name]: '' });
    }

    const HandleSubmit = () => {
        try {
            async function storeData() {
                const response = await API.post('boutique', items);
                const { error, status, message } = response.data;
                setStatus(status);

                if (status === 'failed') {
                    setErrors(error);
                } else {
                    setErrors({});
                    return navigate('/boutique/index', { state: { alert: message } });
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
                <Item elevation={0}>Ajouter Showroom</Item>
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
                    <FormControl style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <TextField
                            id="outlined"
                            label="Nom Showroom"
                            name="nom_boutique"
                            value={items.nom_boutique}
                            onChange={handleInputChange}
                            type="text"
                            required
                            error={errors.nom_boutique ? true : false}
                            helperText={errors.nom_boutique}
                        />
                        <TextField
                            id="outlined"
                            label="Adresse"
                            name="adresse"
                            onChange={handleInputChange}
                            value={items.adresse}
                            type="text"
                            required
                            error={errors.adresse ? true : false}
                            helperText={errors.adresse}
                        />
                        <TextField
                            id="outlined"
                            label="Téléphone"
                            value={items.telephone}
                            name="telephone"
                            onChange={handleInputChange}
                            type="number"
                            required
                            error={errors.telephone ? true : false}
                            helperText={errors.telephone}
                        />
                        <TextField
                            id="outlined"
                            label="email"
                            name="email"
                            onChange={handleInputChange}
                            value={items.email}
                            type="email"
                            error={errors.email ? true : false}
                            helperText={errors.email}
                        />
                        <Button
                            variant="outlined"
                            sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                            onClick={HandleSubmit}
                            to="depot/index"
                        >
                            Enregistrer
                        </Button>
                    </FormControl>
                </Box>
            </MainCard>
        </>
    );
};

export default AddBoutique;
