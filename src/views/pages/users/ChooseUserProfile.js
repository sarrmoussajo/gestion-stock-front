/* eslint-disable no-unused-vars */
import { Button, FormControl, Grid, MenuItem, Paper, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';

const ChooseUserProfile = () => {
    const [profil, setProfil] = useState('');
    const navigate = useNavigate();

    function handleInputChange(e) {
        const { value } = e.target;
        setProfil(value);
    }

    const HandleSubmit = () => {
        if (profil !== '') {
            return navigate('/user/index', { state: { profil: profil } });
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
                <Item elevation={0}>Choisir Profil</Item>
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
                            select
                            label="Profil"
                            name="profil"
                            defaultValue="choose"
                            onChange={handleInputChange}
                            type="select"
                            required
                        >
                            <MenuItem disabled value="choose">
                                Choisir le profil
                            </MenuItem>
                            <MenuItem value="caissier">Gérante Showroom</MenuItem>
                            <MenuItem value="gerant">Gérante Stock</MenuItem>
                        </TextField>
                        <Button variant="outlined" sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }} onClick={HandleSubmit}>
                            voir
                        </Button>
                    </FormControl>
                </Box>
            </MainCard>
        </>
    );
};
export default ChooseUserProfile;
