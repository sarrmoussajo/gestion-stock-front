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
import { Item } from 'views/layouts/Item';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { blue } from '@mui/material/colors';
import themePalette from 'themes/palette';
import { padding } from '@mui/system';

const Audit = () => {
    const [datas, setData] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        try {
            async function getDepots() {
                const response = await API.get('audit');
                const { data, status } = response.data;
                setSpinner(false);
                if (status === 'success') {
                    setData(data);
                }
            }
            getDepots();
        } catch (error) {
            console.log(error);
        }
    }, []);

    function handleClickImprimer() {
        navigate('/audit/imprimer/admin');
    }
    return (
        <>
            <Grid item xs={8}>
                <Item elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Audit Déplacement d'articles{' '}
                    <Chip sx={{ color: 'white', backgroundColor: '#024421' }} label="Imprimer" onClick={handleClickImprimer} />
                </Item>
            </Grid>
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
            {!isEmptyArray(datas) ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Utilisateur</TableCell>
                                <TableCell>Nom Article</TableCell>
                                <TableCell>Nom Showroom</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell align="right">Action</TableCell>
                                <TableCell align="right">Quantité</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datas?.map((item, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{item.user}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {item.nom_article}
                                    </TableCell>
                                    <TableCell>{item.boutique}</TableCell>
                                    <TableCell>{item.depot}</TableCell>

                                    <TableCell align="right">
                                        <Chip label={item.action} size="small" variant="success" />
                                    </TableCell>
                                    <TableCell align="right">{item.quantite}</TableCell>
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
                        <h4>Aucun Déplacement d'article pour le moment</h4>
                    </Box>
                )
            )}
        </>
    );
};

export default Audit;
