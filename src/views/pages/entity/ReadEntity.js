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
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import API, { url } from 'utils/api';
import { isEmptyArray } from 'formik';
import { useEffect } from 'react';
import userImg from 'assets/images/avatar123.jpg';
import { Box } from '@mui/system';
import secureLocalStorage from 'react-secure-storage';

const ReadEntity = () => {
    const location = useLocation();
    const alert = location.state?.alert ? location.state.alert : '';
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState();
    const [entity, setEntity] = useState();
    const [message, setMessage] = useState(alert);
    const [spinner, setSpinner] = useState(true);
    useEffect(() => {
        try {
            async function getEntity() {
                const response = await API.get('entreprise');
                const { data, status } = response.data;
                setSpinner(false);
                setEntity(data);
                setStatus(status);
            }
            getEntity();
        } catch (error) {
            console.log(error);
        }
    }, []);
    function handleDelete() {
        setOpen(!open);
        try {
            async function deleteUser() {
                const response = await API.get(`changer-etat-${profil}/${index}`);
                const { message, status } = response.data;
                setStatus(status);
                setMessage(message);
                const newUserList = entity.filter((usr) => {
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
                <Item elevation={0}>Liste Entreprise</Item>
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

            {entity ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Entreprise</TableCell>
                                <TableCell align="right">Couleur 1</TableCell>
                                <TableCell align="right">Couleur 2</TableCell>
                                <TableCell align="right">Couleur 3</TableCell>
                                <TableCell align="right">Formule</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={entity.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="right">
                                    <Avatar
                                        src={entity.logo ? `${url}/entreprise-images/${entity.logo}` : userImg}
                                        sx={{ width: 30, height: 30 }}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {entity.nom_entreprise}
                                </TableCell>
                                <TableCell align="right">{entity.couleur1 || 'No'}</TableCell>
                                <TableCell align="right">{entity.couleur2 || 'No'}</TableCell>
                                <TableCell align="right">{entity.couleur3 || 'No'}</TableCell>
                                <TableCell align="right">{entity.type}</TableCell>
                                <TableCell align="right">
                                    <RouterLink to={{ pathname: `/entity/edit/${entity.id}` }}>
                                        <EditIcon color="success"></EditIcon>
                                    </RouterLink>
                                </TableCell>
                            </TableRow>
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
                        <h4>Aucune Entreprise pour le moment</h4>
                    </Box>
                )
            )}
        </>
    );
};

export default ReadEntity;
