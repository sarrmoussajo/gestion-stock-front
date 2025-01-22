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
import API from 'utils/api';
import { isEmptyArray } from 'formik';
import { useEffect } from 'react';
import userImg from 'assets/images/avatar123.jpg';
import { Box } from '@mui/system';

const ReadAdmin = () => {
    const location = useLocation();
    const alert = location.state?.alert ? location.state.alert : '';
    const [user, setUser] = useState([]);
    const [message, setMessage] = useState(alert);
    const [spinner, setSpinner] = useState(true);
    useEffect(() => {
        try {
            async function getUser() {
                const response = await API.get('administrateurs');
                const { data, status } = response.data;

                setUser(data);
                setSpinner(false);
            }
            getUser();
        } catch (error) {
            console.log(error);
        }
    }, []);

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
                <Item elevation={0}>Liste Administrateur</Item>
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

            {!isEmptyArray(user) ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Nom Prénom</TableCell>
                                <TableCell align="right">Login</TableCell>
                                <TableCell align="right">Téléphone</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user.map((usr) => (
                                <TableRow key={usr.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">
                                        <Avatar src={userImg} sx={{ width: 30, height: 30 }} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {usr.nom} &nbsp; {usr.prenom}
                                    </TableCell>
                                    <TableCell align="right">{usr.login}</TableCell>
                                    <TableCell align="right">{usr.telephone}</TableCell>
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
                        <h4>Aucun Administrateur pour le moment</h4>
                    </Box>
                )
            )}
        </>
    );
};

export default ReadAdmin;
