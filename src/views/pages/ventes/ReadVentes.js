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
    TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import API from 'utils/api';
import { isEmptyArray } from 'formik';
import { useEffect } from 'react';
import AuthUser from 'views/pages/authentication/authentication3/AuthUser';

const ReadVente = () => {
    const { id } = useParams();
    const location = useLocation();
    const alert = location.state ? location.state.alert : '';
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState();
    const [ventes, setventes] = useState([]);
    const [message, setMessage] = useState(alert);
    const { user } = AuthUser();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [spinner, setSpinner] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        try {
            async function getVentes() {
                var response;
                if (user.profil === 'Caissier') {
                    response = await API.post('ventes-boutique', {
                        id: user.affectation
                    });
                } else if (user.profil === 'Admin') {
                    response = await API.post('ventes-boutique', {
                        id: id
                    });
                }
                const { data, status } = response.data;
                setventes(data);
                setSpinner(false);
                setStatus(status);
            }
            getVentes();
        } catch (error) {
            console.log(error);
        }
    }, []);
    function handleDelete() {
        setOpen(!open);
        try {
            async function deleteVente() {
                const response = await API.delete(`depot/${index}`);
                const { message, status } = response.data;
                setStatus(status);
                setMessage(message);
                const newVenteList = ventes.filter((vente) => {
                    return vente.id !== index;
                });
                setventes(newVenteList);
            }
            deleteVente();
        } catch (error) {
            console.log(error);
        } finally {
            console.log(status);
        }
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
                <Item elevation={0}>Liste des Ventes</Item>
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
                            êtes-vous sûr de vouloir supprimer cette vente ?
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

            {!isEmptyArray(ventes) ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Code de la vente</TableCell>
                                <TableCell>Nom Article</TableCell>
                                <TableCell align="left">Client</TableCell>
                                <TableCell align="left">Quantité</TableCell>
                                <TableCell align="left">Prix</TableCell>
                                <TableCell align="left">Prix Total</TableCell>
                                <TableCell align="left">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ventes?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vente, index) => (
                                <TableRow
                                    key={`${vente.id}-${vente.date_vente}-${index}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {vente.numero_facture}
                                    </TableCell>
                                    <TableCell align="left">{vente.nom_article}</TableCell>
                                    <TableCell align="left">{vente.info_client}</TableCell>
                                    <TableCell align="left">{vente.quantite}</TableCell>
                                    <TableCell align="left">{vente.prix} F CFA</TableCell>
                                    <TableCell align="left">{vente.prix * vente.quantite} F CFA</TableCell>
                                    <TableCell align="left">{vente.date_vente.split(' ')[0]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    count={ventes.length}
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
                        <h4>Aucune vente pour le moment</h4>
                    </Box>
                )
            )}
        </>
    );
};

export default ReadVente;
