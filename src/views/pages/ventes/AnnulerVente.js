/* eslint-disable no-unused-vars */
import {
    Alert,
    Autocomplete,
    Button,
    CardActions,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Box, display } from '@mui/system';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import API from 'utils/api';
import EarningCard from 'views/dashboard/Default/EarningCard';
import PopularCard from 'views/dashboard/Default/PopularCard';
import TotalGrowthBarChart from 'views/dashboard/Default/TotalGrowthBarChart';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import TotalIncomeLightCard from 'views/dashboard/Default/TotalIncomeLightCard';
import TotalOrderLineChartCard from 'views/dashboard/Default/TotalOrderLineChartCard';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import AuthUser from '../authentication/authentication3/AuthUser';
import { ColorLens } from '@mui/icons-material';
import { set } from 'date-fns';

const AnnulerVente = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState();
    const [formData, setFormData] = useState({
        numero_facture: ''
    });
    const [numero_facture, setNumeroFacture] = useState([]);
    const [errors, setErrors] = useState({});
    const { user } = AuthUser();

    /* const navigate = useNavigate();*/

    function handleInputChange(e) {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
        setErrors({});
    }

    const HandleNext = () => {
        try {
            async function verifyNumFacture() {
                const response = await API.post(`ventes-facture`, {
                    id: user.affectation,
                    numero_facture: formData.numero_facture
                });
                const { status } = response.data;
                if (status == 'success') {
                    const { data } = response.data;
                    setItems(data);
                    setNumeroFacture(formData.numero_facture);
                } else {
                    const { message } = response.data;
                    setErrors({ ...errors, message: message });
                }
            }
            verifyNumFacture();
        } catch (error) {
            console.log(error);
        }
    };

    const HandleDelete = () => {
        try {
            async function deleteVente() {
                if (items) {
                    const response = await API.post(`annuler-vente`, {
                        id: user.affectation,
                        numero_facture: numero_facture
                    });
                    const { status } = response.data;
                    if (status == 'success') {
                        const { message } = response.data;
                        setMessage(message);
                        setItems();
                        setFormData({});
                    } else {
                        const { errors } = response.data;
                        setErrors(errors);
                    }
                }
            }
            deleteVente();
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
                <Item elevation={0}>Annuler une Vente</Item>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    {message !== '' && (
                        <Alert
                            onClose={() => {
                                setMessage('');
                            }}
                        >
                            {message}
                        </Alert>
                    )}
                    <Grid container spacing={gridSpacing}>
                        {/* )} */}
                        <Grid item xs={12} md={4}>
                            <MainCard content={false}>
                                <CardContent>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12}>
                                            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <Grid item>
                                                    <Box
                                                        component="form"
                                                        sx={{
                                                            '& .MuiTextField-root': { m: 1 }
                                                        }}
                                                        fullWidth
                                                    >
                                                        <FormControl
                                                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                                                        >
                                                            <TextField
                                                                id="outlined"
                                                                label="Entrer le code de la vente"
                                                                name="numero_facture"
                                                                value={formData.numero_facture || ''}
                                                                onChange={handleInputChange}
                                                                type="text"
                                                                required
                                                                error={errors.num_facture ? true : false}
                                                                helperText={errors.num_facture}
                                                            />

                                                            <Button
                                                                variant="outlined"
                                                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                onClick={HandleNext}
                                                                disabled={formData.numero_facture !== '' ? false : true}
                                                            >
                                                                Lister Articles
                                                            </Button>
                                                        </FormControl>
                                                        <Typography color={'red'}>{errors && errors.message}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}></Grid>
                                    </Grid>
                                </CardContent>
                            </MainCard>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <MainCard>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nom Article</TableCell>
                                                    <TableCell align="left">Quantité</TableCell>
                                                    <TableCell align="left">Prix</TableCell>
                                                    <TableCell align="left">Date</TableCell>
                                                    <TableCell align="left">Heure</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {items?.map((item) => (
                                                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">
                                                            {item.nom_article}
                                                        </TableCell>

                                                        <TableCell align="left">{item.quantite}</TableCell>
                                                        <TableCell align="left">{item.prix_vente}</TableCell>
                                                        <TableCell align="left">{item.date_vente.split(' ')[0]}</TableCell>
                                                        <TableCell align="left">{item.date_vente.split(' ')[1]}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {items && (
                                            <Button
                                                variant="error"
                                                sx={{ margin: 1, color: 'red', backgroundColor: '#EDE7F6' }}
                                                onClick={HandleDelete}
                                            >
                                                Supprimer Tout
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default AnnulerVente;
