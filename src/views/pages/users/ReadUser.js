/* eslint-disable no-unused-vars */
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    Link,
    Alert,
    DialogTitle,
    Dialog,
    DialogContentText,
    DialogActions,
    DialogContent,
    Typography,
    Avatar,
    Grid,
    styled,
    CircularProgress,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API, { url } from 'utils/api';
import { isEmptyArray } from 'formik';
import { useEffect } from 'react';
import userImg from 'assets/images/avatar123.jpg';
import { Box } from '@mui/system';

const ReadUser = () => {
    const location = useLocation();
    const alert = location.state.alert ? location.state.alert : '';
    const profil = location.state ? location.state.profil : null;
    const data = location.state.data ? location.state.data : null;
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [openDialogCompte, setOpenDialogCompte] = useState(data ? true : false);
    const [index, setIndex] = useState();
    const [user, setUser] = useState([]);
    const [message, setMessage] = useState(alert);
    const [spinner, setSpinner] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            async function getUser() {
                const response = await API.get(profil);
                const { data, status } = response.data;
                setUser(data);
                setSpinner(false);
                setStatus(status);
            }
            if (profil) {
                getUser();
            }
        } catch (error) {
            console.log(error);
        }
    }, [profil]);
    function handleDelete() {
        setOpen(!open);
        try {
            async function deleteUser() {
                const response = await API.get(`changer-etat-${profil}/${index}`);
                const { message, status } = response.data;
                setStatus(status);
                setMessage(message);
                const newUserList = user.filter((usr) => {
                    return usr.id !== index;
                });
                setUser(newUserList);
            }
            deleteUser();
        } catch (error) {
            console.log(error);
        } finally {
            console.log(status);
        }
    }

    function toUpdate(id) {
        return navigate(`/user/edit/${profil}/${id}`);
    }

    function handleCloseDialogCompte() {
        return setOpenDialogCompte(false);
    }

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.h2,
        textAlign: 'left',
        height: 60,
        lineHeight: '60px',
        marginBottom: 20,
        paddingLeft: 15
    }));

    const [timeOut, setTimeOut] = useState(0);
    setTimeout(() => {
        setTimeOut(1);
    }, 5000);

    return (
        <>
            {openDialogCompte && (
                <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Compte</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-title">Login : {data['login']}</DialogContentText>
                        <DialogContentText id="alert-dialog-title">Mot de passe : {data['password']}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCloseDialogCompte()}>OK</Button>
                    </DialogActions>
                </Dialog>
            )}
            {open ? (
                <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{'Suppression données'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            êtes-vous sûr de vouloir supprimer le {profil} ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Annuler</Button>
                        <Button onClick={() => handleDelete()}>Confirmer</Button>
                    </DialogActions>
                </Dialog>
            ) : null}
            {spinner && (
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {!isEmptyArray(user) ? (
                <>
                    <Grid item xs={8}>
                        <Item elevation={0}>{profil === 'caissier' ? 'Gérants Showroom' : 'Gérants Stock'}</Item>
                    </Grid>
                    {message !== '' && timeOut === 0 && (
                        <Alert
                            onClose={() => {
                                setMessage('');
                            }}
                        >
                            {message}
                        </Alert>
                    )}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Nom Prénom</TableCell>
                                    <TableCell align="right">Login</TableCell>
                                    <TableCell align="right">Téléphone</TableCell>
                                    {profil === 'gerant' ? (
                                        <TableCell align="right">Dépot</TableCell>
                                    ) : (
                                        <TableCell align="right">Showroom</TableCell>
                                    )}
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {user.map((usr) => (
                                    <TableRow key={usr.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="right">
                                            <Avatar
                                                src={usr.image ? `${url}/users-images/${usr.image}` : userImg}
                                                sx={{ width: 30, height: 30 }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {usr.nom} &nbsp; {usr.prenom}
                                        </TableCell>
                                        <TableCell align="right">{usr.login}</TableCell>
                                        <TableCell align="right">{usr.telephone}</TableCell>
                                        {profil === 'gerant' ? (
                                            <TableCell align="right">{usr.nom_depot}</TableCell>
                                        ) : (
                                            <TableCell align="right">{usr.nom_boutique}</TableCell>
                                        )}
                                        <TableCell align="right">
                                            <Chip
                                                label="Modifier"
                                                component="a"
                                                href="#basic-chip"
                                                //variant="outlined"
                                                clickable
                                                color="success"
                                                onClick={() => {
                                                    toUpdate(usr.id);
                                                }}
                                            />
                                            &nbsp;&nbsp;
                                            <Chip
                                                label="Supprimer"
                                                // variant="outlined"
                                                color="error"
                                                onClick={() => {
                                                    setOpen(true);
                                                    setIndex(usr.id);
                                                }}
                                                deleteIcon={<DeleteIcon />}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                !spinner && (
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '5vh',
                            backgroundColor: '#006838',
                            color: 'white',
                            margin: '15vw 20vw 0vw 20vw',
                            borderRadius: '10px'
                        }}
                    >
                        <h4>Aucun utilisateur pour le moment</h4>
                    </Box>
                )
            )}
        </>
    );
};

export default ReadUser;
