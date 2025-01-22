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
    styled,
    Grid,
    Box,
    CircularProgress,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from 'utils/api';
import { isEmptyArray } from 'formik';
import { useEffect } from 'react';
import { MonetizationOnRounded, ShoppingBag, ShoppingCart } from '@mui/icons-material';
import AuthUser from '../authentication/authentication3/AuthUser';

const ReadBoutique = () => {
    const location = useLocation();
    const alert = location.state ? location.state.alert : '';
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState();
    const [boutiques, setBoutiques] = useState([]);
    const [message, setMessage] = useState(alert);
    const [spinner, setSpinner] = useState(true);
    const navigate = useNavigate();
    const { user } = AuthUser();

    useEffect(() => {
        try {
            async function getDepots() {
                const response = await API.get('boutique');
                const { data, status } = response.data;
                setSpinner(false);
                setBoutiques(data);
                setStatus(status);
            }
            getDepots();
        } catch (error) {
            console.log(error);
        }
    }, []);
    function handleDelete() {
        setOpen(!open);
        try {
            async function deleteDepot() {
                console.log(index);
                const response = await API.delete(`boutique/${index}`);
                const { message, status } = response.data;
                setStatus(status);
                setMessage(message);
                const newDepotList = boutiques.filter((boutique) => {
                    return boutique.id !== index;
                });
                setBoutiques(newDepotList);
            }
            deleteDepot();
        } catch (error) {
            console.log(error);
        } finally {
            console.log(status);
        }
    }

    function toArticles(id) {
        return navigate(`/boutique/article/${'boutique'}/${id}`);
    }

    function toVentes(id) {
        return navigate(`/boutique/vente/index/${id}`);
    }

    function toUpdate(id, boutique) {
        return navigate(`/boutique/edit/${id}`, { boutique: { boutique } });
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
            <Grid item xs={8}>
                <Item elevation={0}>Liste des Showrooms</Item>
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

            {open ? (
                <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{'Suppression données'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            êtes-vous sûr de vouloir supprimer la Showroom ?
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
            {!isEmptyArray(boutiques) ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom Showroom</TableCell>
                                <TableCell align="right">Adresse</TableCell>
                                <TableCell align="right">Téléphone</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {boutiques?.map((boutique) => (
                                <TableRow key={boutique.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {boutique.nom_boutique}
                                    </TableCell>
                                    <TableCell align="right">{boutique.adresse}</TableCell>
                                    <TableCell align="right">{boutique.telephone}</TableCell>
                                    <TableCell align="right">{boutique.email}</TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label="Articles"
                                            //  variant="outlined"
                                            color="secondary"
                                            onClick={() => {
                                                toArticles(boutique.id);
                                            }}
                                        />
                                        &nbsp;&nbsp;
                                        {user.profil === 'Admin' && (
                                            <>
                                                <Chip
                                                    label="Ventes"
                                                    //  variant="outlined"
                                                    color="primary"
                                                    onClick={() => {
                                                        toVentes(boutique.id);
                                                    }}
                                                />
                                                &nbsp;&nbsp;
                                                <Chip
                                                    label="Modifier"
                                                    component="a"
                                                    href="#basic-chip"
                                                    //variant="outlined"
                                                    clickable
                                                    color="success"
                                                    onClick={() => {
                                                        toUpdate(boutique.id);
                                                    }}
                                                />
                                                &nbsp;&nbsp;
                                                <Chip
                                                    label="Supprimer"
                                                    // variant="outlined"
                                                    color="error"
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setIndex(boutique.id);
                                                    }}
                                                    deleteIcon={<DeleteIcon />}
                                                />
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                !spinner && (
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '5vh',
                            backgroundColor: '#A38CD3',
                            color: 'white',
                            margin: '15vw 20vw 0vw 20vw',
                            borderRadius: '10px'
                        }}
                    >
                        <h4>Aucun showroom pour le moment</h4>
                    </Box>
                )
            )}
        </>
    );
};

export default ReadBoutique;
