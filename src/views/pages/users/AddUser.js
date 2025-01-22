/* eslint-disable no-unused-vars */
import { Avatar, Box, Button, Grid, MenuItem, Paper, styled, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/api';
import userImg from 'assets/images/avatar123.jpg';
import AuthUser from '../authentication/authentication3/AuthUser';

const AddUser = () => {
    const [items, setItems] = useState({ nom: '', prenom: '', telephone: '', profil: '', affectation: '', file: '' });
    const [status, setStatus] = useState(['']);
    const [image, setImage] = useState();
    const [imageFile, setImageFile] = useState();
    const [errors, setErrors] = useState({});
    const [aft, setAffectation] = useState([]);
    const [utilisateur, setUtilisateur] = useState({});
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
                var table = '';
                if (items.profil === 'caissier') {
                    table = 'boutique';
                } else if (items.profil === 'gerant') {
                    table = 'depot';
                }
                if (table !== '') {
                    const response = await api.get(table);
                    const { data, status } = response.data;
                    setAffectation(data);
                    setStatus(status);
                }
            }
            getData();
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.profil]);

    const HandleSubmit = () => {
        try {
            async function storeData() {
                let formData = new FormData();
                formData.append('nom', items.nom);
                formData.append('prenom', items.prenom);
                formData.append('telephone', items.telephone);
                formData.append('affectation', items.affectation);
                const response = await api.post(items.profil, formData);
                const { error, status } = response.data;
                setStatus(status);

                if (error) {
                    setErrors(error);
                } else {
                    setErrors({});
                    const { message, data } = response.data;
                    setUtilisateur(data);
                    return navigate('/user/index', { state: { alert: message, profil: items.profil, data: data } });
                }
            }
            if (items.profil) {
                storeData();
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
                <Item elevation={0}>Ajouter Utilisateur</Item>
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
                            {user.profil !== 'Admin' && (
                                <Button component="span">
                                    ajouter photo
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        type="file"
                                        name="image"
                                        onChange={handleInputChange}
                                    />
                                </Button>
                            )}
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
                            <TextField
                                id="outlined"
                                select
                                label="Profil"
                                name="profil"
                                defaultValue="choose"
                                onChange={handleInputChange}
                                type="select"
                                required
                                error={errors.profil ? true : false}
                                helperText={errors.profil}
                            >
                                <MenuItem disabled value="choose">
                                    Choisir le profil
                                </MenuItem>
                                <MenuItem value="caissier">Gérante Showroom</MenuItem>
                                <MenuItem value="gerant">Gérante Stock</MenuItem>
                            </TextField>
                            {items.profil === 'caissier' && (
                                <TextField
                                    id="outlined"
                                    select
                                    label={'Showroom'}
                                    name="affectation"
                                    defaultValue="choose"
                                    onChange={handleInputChange}
                                    type="select"
                                    required
                                    error={errors.affectation ? true : false}
                                    helperText={errors.affectation}
                                >
                                    <MenuItem disabled value="choose">
                                        Choisir le Showroom
                                    </MenuItem>
                                    {aft.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nom_boutique}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                            {items.profil === 'gerant' && (
                                <TextField
                                    id="outlined"
                                    select
                                    label={'Dépot'}
                                    name="affectation"
                                    defaultValue="choose"
                                    onChange={handleInputChange}
                                    type="select"
                                    required
                                    error={errors.affectation ? true : false}
                                    helperText={errors.affectation}
                                >
                                    <MenuItem disabled value="choose">
                                        Choisir le dépot
                                    </MenuItem>
                                    {aft.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nom_depot}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
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

export default AddUser;
