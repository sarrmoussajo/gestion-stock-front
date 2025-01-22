/* eslint-disable no-unused-vars */
import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    MenuItem,
    Paper,
    styled,
    TextField
} from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import api, { url } from 'utils/api';
import userImg from 'assets/images/avatar123.jpg';
import AuthUser from '../authentication/authentication3/AuthUser';

const EditUser = () => {
    const { profil, id } = useParams();
    const location = useLocation();
    const alert = location.state?.alert ? location.state.alert : '';
    const [items, setItems] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        profil: profil,
        affectation: '',
        file: '',
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [image, setImage] = useState();
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState();
    const [aft, setAffectation] = useState([]);
    const [imageFile, setImageFile] = useState({});
    const [message, setMessage] = useState(alert);
    const navigate = useNavigate();
    const { user, updateUser } = AuthUser();
    var formData = new FormData();
    const [openDialog, setOpenDialog] = useState(false);
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);

    function handleInputChange(e) {
        setMessage('');
        const nameInput = e.target.name;
        if (nameInput === 'image') {
            const newImage = e.target?.files?.[0];
            const objectUrl = URL.createObjectURL(newImage);
            setImage(objectUrl);
            setImageFile(e.target?.files?.[0]);
            setOpenDialog(true);
        }
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
        setErrors({ ...errors, [name]: '' });
    }

    useEffect(() => {
        try {
            async function getData() {
                const response = await api.get(`${profil}/${id}`);
                const { data, status } = response.data;
                setItems(data);
                if (data?.image !== null) {
                    setImage(`${url}/users-images/${data.image}`);
                }
                setStatus(status);
            }
            getData();
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            async function getData() {
                var table = '';
                if (profil === 'caissier') {
                    table = 'boutique';
                } else if (profil === 'gerant') {
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
    }, [profil]);

    const HandleSubmit = () => {
        try {
            async function storeData() {
                formData.append('_method', 'PUT');
                formData.append('id', id);
                formData.append('nom', items.nom);
                formData.append('prenom', items.prenom);
                formData.append('telephone', items.telephone);
                formData.append('affectation', items.affectation);
                const response = await api.post(`${profil}`, formData, {
                    headers: { 'Content-type': 'multipart/form-data' }
                });
                const { status, message } = response.data;

                if (status === 'failed') {
                    setErrors(message);
                } else {
                    if (user.profil === 'Admin') {
                        return navigate('/user/index', { state: { alert: message, profil: profil } });
                    } else {
                        setMessage(message);
                        return navigate(`/user/edit/${profil}/${user.id}`);
                    }
                }
            }
            storeData();
        } catch (error) {
            console.log(error);
        }
    };

    const HandlePasswordChange = () => {
        try {
            async function updatePassword() {
                let formData2 = new FormData();
                formData2.append('user_id', id);
                formData2.append('old_password', items.old_password);
                formData2.append('new_password', items.new_password);
                formData2.append('confirm_password', items.confirm_password);
                formData2.append('Content-Type', 'multipart/form-data');
                const response = await api.post('change-password', {
                    user_id: id,
                    old_password: items.old_password,
                    new_password: items.new_password,
                    confirm_password: items.confirm_password
                });
                const { status, message, error } = response.data;

                if (status === 'failed') {
                    console.log(response.data);
                    setErrors(error);
                } else {
                    setMessage(message);
                    console.log(message);
                    setChangePasswordDialog(false);
                }
            }
            updatePassword();
        } catch (error) {
            console.log(error);
        }
    };
    const HandleImageProfile = () => {
        try {
            async function storeData() {
                formData.append('_method', 'PUT');
                formData.append('id', id);
                formData.append('image', imageFile);
                const response = await api.post(`${profil}-photo`, formData, {
                    headers: { 'Content-type': 'multipart/form-data' }
                });
                const { status, message, data } = response.data;

                if (status === 'failed') {
                    setErrors(message);
                    console.log(message);
                } else {
                    if (user.profil === 'Admin') {
                        return navigate('/user/index', { state: { alert: message, profil: profil } });
                    } else {
                        setMessage(message);
                        setOpenDialog(false);
                        user.image = data;
                        updateUser(user);

                        window.location.reload(false);
                    }
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
            {openDialog && (
                <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{'Suppression données'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">Voulez-vous modifier votre photo ?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                        <Button onClick={() => HandleImageProfile()}>Confirmer</Button>
                    </DialogActions>
                </Dialog>
            )}

            {changePasswordDialog && (
                <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Modifier votre mot de passe</DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1 }
                            }}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '30vw ' }}
                        >
                            <TextField
                                //id="outlined"
                                label="Ancien mot de passe"
                                name="old_password"
                                onChange={handleInputChange}
                                // value={items?.telephone}
                                type="password"
                                required
                                error={errors?.old_password ? true : false}
                                helperText={errors?.old_password}
                            />

                            <TextField
                                //id="outlined"
                                label="Nouveau mot de passe"
                                name="new_password"
                                //value={profil}
                                onChange={handleInputChange}
                                type="password"
                                required
                                error={errors?.new_password ? true : false}
                                helperText={errors?.new_password}
                            />

                            <TextField
                                //id="outlined"
                                label="Confirmer mot de passe"
                                name="confirm_password"
                                //value={profil}
                                onChange={handleInputChange}
                                type="password"
                                required
                                error={errors?.confirm_password ? true : false}
                                helperText={errors?.confirm_password}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setChangePasswordDialog(false);
                            }}
                        >
                            Annuler
                        </Button>
                        <Button onClick={() => HandlePasswordChange()}>Confirmer</Button>
                    </DialogActions>
                </Dialog>
            )}

            <Grid item xs={8}>
                <Item elevation={0}>{user?.profil.toLowerCase() === profil ? 'Paramétre Utilisateur' : 'Modifer Profil'}</Item>
            </Grid>
            {message !== '' && (
                <Alert
                    onClose={() => {
                        setMessage('');
                    }}
                >
                    {message}
                </Alert>
            )}
            <MainCard sx={{ minwidth: 100, ml: '10vw', mr: '10vw' }}>
                <Box display="flex" flexDirection="row" justifyContent="space-evenly" alignItems="flex-start">
                    <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {image ? (
                            <Avatar src={image} sx={{ width: 200, height: 200 }} />
                        ) : (
                            <Avatar src={userImg} sx={{ width: 200, height: 200 }} />
                        )}
                        <label htmlFor="raised-button-file" style={{ alignSelf: 'center' }}>
                            {user?.profil !== 'Admin' && (
                                <Button component="span">
                                    Modifier photo
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
                        <label style={{ alignSelf: 'center' }}>
                            {user?.profil !== 'Admin' && (
                                <Button
                                    onClick={() => {
                                        setChangePasswordDialog(true);
                                        setErrors({});
                                    }}
                                >
                                    Modifier mot de passe
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
                                value={items?.nom || ''}
                                type="text"
                                required
                                error={errors?.nom ? true : false}
                                helperText={errors?.nom}
                            />
                            <TextField
                                id="outlined"
                                label="Prénom"
                                name="prenom"
                                onChange={handleInputChange}
                                value={items?.prenom}
                                type="text"
                                required
                                error={errors?.prenom ? true : false}
                                helperText={errors?.prenom}
                            />
                            <TextField
                                id="outlined"
                                label="Téléphone"
                                name="telephone"
                                onChange={handleInputChange}
                                value={items?.telephone}
                                type="number"
                                required
                                error={errors?.telephone ? true : false}
                                helperText={errors?.telephone}
                            />
                            {profil === 'admin' && (
                                <TextField
                                    id="outlined"
                                    label="Profil"
                                    name="profil"
                                    value={profil}
                                    onChange={handleInputChange}
                                    type="text"
                                    required
                                    disabled
                                    error={errors?.profil ? true : false}
                                    helperText={errors?.profil}
                                />
                            )}
                            {user.profil === 'Caissier' && (
                                <>
                                    <TextField
                                        id="outlined"
                                        label="Profil"
                                        name="profil"
                                        value={profil}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                        disabled
                                        error={errors?.profil ? true : false}
                                        helperText={errors?.profil}
                                    />

                                    <TextField
                                        id="outlined"
                                        disabled
                                        label={'Boutique'}
                                        name="affectation"
                                        value={user.nom_local}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                        error={errors?.affectation ? true : false}
                                        helperText={errors?.affectation}
                                    />
                                </>
                            )}
                            {user.profil === 'Gerant' && (
                                <>
                                    <TextField
                                        id="outlined"
                                        label="Profil"
                                        name="profil"
                                        value={profil}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                        disabled
                                        error={errors?.profil ? true : false}
                                        helperText={errors?.profil}
                                    />
                                    <TextField
                                        id="outlined"
                                        label={'Dépot'}
                                        name="affectation"
                                        value={user.nom_local}
                                        onChange={handleInputChange}
                                        type="text"
                                        disabled={true}
                                        required
                                        error={errors?.affectation ? true : false}
                                        helperText={errors?.affectation}
                                    />
                                </>
                            )}
                            {user.profil === 'Admin' && profil === 'gerant' && (
                                <>
                                    <TextField
                                        id="outlined"
                                        select
                                        label="Profil"
                                        name="profil"
                                        defaultValue="choose"
                                        onChange={handleInputChange}
                                        type="select"
                                        required
                                        error={errors?.profil ? true : false}
                                        helperText={errors?.profil}
                                    >
                                        <MenuItem disabled value="choose">
                                            Choisir le profil
                                        </MenuItem>
                                        <MenuItem value="caissier">Gérant Showroom</MenuItem>
                                        <MenuItem selected={true} value="gerant">
                                            Gérant Stock
                                        </MenuItem>
                                    </TextField>
                                    <TextField
                                        id="outlined"
                                        select
                                        label={'Dépot'}
                                        name="affectation"
                                        defaultValue="choose"
                                        onChange={handleInputChange}
                                        type="select"
                                        required
                                        error={errors?.affectation ? true : false}
                                        helperText={errors?.affectation}
                                    >
                                        <MenuItem disabled value="choose">
                                            Choisir le dépot
                                        </MenuItem>
                                        {aft?.map((option) => (
                                            <MenuItem key={option.id} value={option.id} selected={option.id === items.id ? true : false}>
                                                {option.nom_depot}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </>
                            )}
                            {user.profil === 'Admin' && profil === 'caissier' && (
                                <>
                                    <TextField
                                        id="outlined"
                                        select
                                        label="Profil"
                                        name="profil"
                                        defaultValue="choose"
                                        onChange={handleInputChange}
                                        type="select"
                                        required
                                        error={errors?.profil ? true : false}
                                        helperText={errors?.profil}
                                    >
                                        <MenuItem disabled value="choose">
                                            Choisir le profil
                                        </MenuItem>
                                        <MenuItem selected={true} value="caissier">
                                            Gérant Showroom
                                        </MenuItem>
                                        <MenuItem value="gerant">Gérant Stock</MenuItem>
                                    </TextField>
                                    <TextField
                                        id="outlined"
                                        select
                                        label={'boutique'}
                                        name="affectation"
                                        defaultValue="choose"
                                        onChange={handleInputChange}
                                        type="select"
                                        required
                                        error={errors?.affectation ? true : false}
                                        helperText={errors?.affectation}
                                    >
                                        <MenuItem disabled value="choose">
                                            Choisir la boutique
                                        </MenuItem>
                                        {aft.map((option) => (
                                            <MenuItem key={option.id} value={option.id} selected={option.id === items.id ? true : false}>
                                                {option.nom_boutique}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </>
                            )}

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
        </>
    );
};

export default EditUser;
