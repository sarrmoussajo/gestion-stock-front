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
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
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
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import MUIDataTable from 'mui-datatables';

const ImprimerAudit = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);
    const [data, setData] = useState();
    const [formData, setFormData] = useState({
        nom_boutique: '',
        date_debut: '',
        date_fin: '',
        type: ''
    });
    const [errors, setErrors] = useState({});

    /* const navigate = useNavigate();*/

    function handleInputChange(e) {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
        setErrors({});
        setMessage('');
    }

    const columns = [
        { name: 'user', label: 'Utilisateur' },
        { name: 'nom_article', label: 'Nom Article' },
        { name: 'boutique', label: 'Nom Boutique' }
        // { name: 'depot', label: 'Nom Dépot' },
        // { name: 'action', label: 'Action effectuée' },
        // { name: 'quantite', label: 'Quantité' },
        // { name: 'date_vente', label: 'Date' }
    ];

    const options = {
        filterType: 'checkbox',
        textLabels: {
            body: {
                noMatch: "Désolé, aucun enregistrement correspondant n'a été trouvé",
                toolTip: 'Sort',
                columnHeaderTooltip: (column) => `Sort for ${column.label}`
            },
            pagination: {
                next: 'Next Page',
                previous: 'Page précédente',
                rowsPerPage: 'Lignes par page :',
                displayRows: 'de'
            },
            toolbar: {
                search: 'Chercher',
                downloadCsv: 'Télécharger CSV',
                print: 'Imprimer',
                viewColumns: 'Voir les colonnes',
                filterTable: 'Tableau des filtres'
            },
            filter: {
                all: 'Tout',
                title: 'FILTRES',
                reset: 'RETOUR'
            },
            viewColumns: {
                title: 'Afficher les colonnes',
                titleAria: 'Afficher/masquer les colonnes du tableau'
            },
            selectedRows: {
                text: 'ligne(s) sélectionnée(s)',
                delete: 'Delete',
                deleteAria: 'Supprimer les lignes sélectionnées'
            }
        }
    };

    const HandleSubmit = () => {
        try {
            inventaire();
            async function inventaire() {
                const response = await API.post(`imprimer-audit`, {
                    date_debut: formData.date_debut,
                    date_fin: formData.date_fin
                });
                const { status } = response.data;
                if (status === 'success') {
                    const { data } = response.data;
                    setData(data);

                    //setMessage(message);
                } else {
                    const { errors } = response.data;
                    setErrors({ ...errors, message: 'Veuillez revoir vos éléments saisis' });
                }
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

    const result = !data ? (
        <>
            <Grid item xs={8}>
                <Item elevation={0}>Audit périodique</Item>
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
                        <Grid item xs={12} md={4}></Grid>
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
                                                            <FormControl sx={{ mr: 2, minWidth: 100 }}></FormControl>

                                                            <TextField
                                                                id="outlined"
                                                                name="date_debut"
                                                                value={formData?.date_debut}
                                                                onChange={handleInputChange}
                                                                type="date"
                                                                required
                                                            />

                                                            <TextField
                                                                id="outlined"
                                                                name="date_fin"
                                                                value={formData.date_fin || ''}
                                                                onChange={handleInputChange}
                                                                type="date"
                                                                required
                                                            />

                                                            <Button
                                                                variant="outlined"
                                                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                onClick={HandleSubmit}
                                                                disabled={
                                                                    formData.date_debut !== '' && formData.date_fin !== '' ? false : true
                                                                }
                                                            >
                                                                Envoyer
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
                    </Grid>
                </Grid>
            </Grid>
        </>
    ) : (
        <MUIDataTable
            title={`Listes des ${formData.type} du ${formData.date_debut} au ${formData.date_fin}`}
            data={data}
            columns={columns}
            options={options}
        />
    );
    return result;
};

export default ImprimerAudit;
