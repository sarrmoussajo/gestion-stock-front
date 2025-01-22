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
    TableFooter,
    TablePagination,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from 'utils/api';
import { isEmptyArray } from 'formik';
import { useEffect } from 'react';
import { format } from 'date-fns';
import AuthUser from '../authentication/authentication3/AuthUser';

const ReadFrais = () => {
    const location = useLocation();
    const alert = location.state ? location.state.alert : '';
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState();
    const [frais, setFrais] = useState([]);
    const [message, setMessage] = useState(alert);
    const [type_local, setTypeLocal] = useState('');
    const { user } = AuthUser();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [spinner, setSpinner] = useState(true);
    const navigate = useNavigate();
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        try {
            async function getFrais() {
                if (user.profil === 'Caissier') {
                    setTypeLocal('Boutique');
                } else if (user.profil === 'Gerant') {
                    setTypeLocal('Depot');
                } else {
                    setTypeLocal('admin');
                }

                const response = await API.post('get-frais', {
                    id: user.affectation,
                    type_local: type_local
                });
                const { data, status, message } = response.data;
                setFrais(data);
                setSpinner(false);
                setStatus(status);
            }
            getFrais();
        } catch (error) {
            console.log(error);
        }
    }, [type_local, message]);
    function handleDelete() {
        setOpen(!open);
        try {
            async function deleteFrais() {
                const response = await API.delete(`frais/${index}`);
                const { message, status } = response.data;
                setStatus(status);
                setMessage(message);
                const newFraisList = frais.filter((fr) => {
                    return fr.id !== index;
                });
                setFrais(newFraisList);
            }
            deleteFrais();
        } catch (error) {
            console.log(error);
        } finally {
            console.log(status);
        }
    }

    function toUpdate(id) {
        return navigate(`/frais/edit/${id}`);
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
                <Item elevation={0}>Liste Frais</Item>
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
                        <DialogContentText id="alert-dialog-description">êtes-vous sûr de vouloir supprimer le frais ?</DialogContentText>
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

            {!isEmptyArray(frais) ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom Frais</TableCell>
                                <TableCell align="right">Local</TableCell>
                                <TableCell align="right">Montant</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {frais?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fr) => (
                                <TableRow key={fr.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {fr.nom_frais}
                                    </TableCell>
                                    <TableCell align="right">{fr.nom_local}</TableCell>
                                    <TableCell align="right">{fr.montant_frais}</TableCell>
                                    <TableCell align="right">{format(new Date(fr.date_frais), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell align="right">{fr.description}</TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label="Modifier"
                                            component="a"
                                            href="#basic-chip"
                                            //variant="outlined"
                                            clickable
                                            color="success"
                                            onClick={() => {
                                                toUpdate(fr.id);
                                            }}
                                        />
                                        &nbsp;&nbsp;
                                        <Chip
                                            label="Supprimer"
                                            // variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                setOpen(true);
                                                setIndex(fr.id);
                                            }}
                                            deleteIcon={<DeleteIcon />}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    count={frais?.length || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
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
                        <h4>Aucun frais pour le moment</h4>
                    </Box>
                )
            )}
        </>
    );
};

export default ReadFrais;
