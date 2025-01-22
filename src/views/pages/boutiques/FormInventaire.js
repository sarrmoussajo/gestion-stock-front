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

const FormInventaire = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);
    const [ventes, setVentes] = useState();
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

    const columnsVentes = [
        { name: 'nom_article', label: 'Article' },
        { name: 'code', label: 'Code' },
        { name: 'numero_facture', label: 'Numéro Facture' },
        { name: 'prix', label: 'Prix FCFA' },
        { name: 'quantite', label: 'Quantité' },
        { name: 'date_vente', label: 'Date de vente' }
    ];

    const columnsFrais = [
        { name: 'nom_frais', label: 'Intitulé' },
        { name: 'description', label: 'Description' },
        { name: 'montant_frais', label: 'Montant FCFA' },
        { name: 'date_frais', label: 'Date Frais' }
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
                previous: 'Previous Page',
                rowsPerPage: 'Rows per page:',
                displayRows: 'of'
            },
            toolbar: {
                search: 'Search',
                downloadCsv: 'Download CSV',
                print: 'Print',
                viewColumns: 'View Columns',
                filterTable: 'Filter Table'
            },
            filter: {
                all: 'All',
                title: 'FILTERS',
                reset: 'RESET'
            },
            viewColumns: {
                title: 'Show Columns',
                titleAria: 'Show/Hide Table Columns'
            },
            selectedRows: {
                text: 'row(s) selected',
                delete: 'Delete',
                deleteAria: 'Delete Selected Rows'
            }
        }
    };

    const GetBoutiqueID = () => {
        const boutique = items.find((item) => item.nom_boutique === formData.nom_boutique);
        if (boutique) {
            return boutique.id;
        }
        setErrors({ ...errors, message: 'Les informations renseignées ne sont pas disponibles' });
        return 0;
    };
    const HandleSubmit = () => {
        try {
            const boutique_id = GetBoutiqueID();
            if (boutique_id) {
                inventaire();
            }
            async function inventaire() {
                const response = await API.post(`inventaire-boutique`, {
                    boutique_id: boutique_id,
                    date_debut: formData.date_debut,
                    date_fin: formData.date_fin
                });
                const { status } = response.data;
                if (status === 'success') {
                    const { vente, frais } = response.data;
                    if (formData.type === 'frais') {
                        setVentes(frais);
                    } else if (formData.type === 'ventes') {
                        setVentes(vente);
                    }

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
    useEffect(() => {
        try {
            async function getArticles() {
                const response = await API.get(`boutique`);
                const { data, status } = response.data;
                setItems(data);
            }

            getArticles();
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.h2,
        textAlign: 'left',
        height: 60,
        lineHeight: '60px',
        marginBottom: 20,
        paddingLeft: 15
    }));

    const result = !ventes ? (
        <>
            <Grid item xs={8}>
                <Item elevation={0}>Inventaire périodique</Item>
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
                                                            <FormControl sx={{ mr: 2, minWidth: 100 }}>
                                                                <Autocomplete
                                                                    freeSolo
                                                                    inputvalue={formData.nom_boutique}
                                                                    disableClearable
                                                                    id="outlined"
                                                                    options={items?.map((option) => option.nom_boutique)}
                                                                    onChange={(event, value) =>
                                                                        setFormData({ ...formData, ['nom_boutique']: value })
                                                                    }
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Nom Showroom"
                                                                            name="nom_boutique"
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            InputProps={{
                                                                                ...params.InputProps,
                                                                                type: 'search'
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            </FormControl>

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

                                                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                                <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-helper-label"
                                                                    id="demo-simple-select-helper"
                                                                    name="type"
                                                                    label="type"
                                                                    onChange={handleInputChange}
                                                                >
                                                                    <MenuItem value={'ventes'}>Ventes</MenuItem>
                                                                </Select>
                                                            </FormControl>

                                                            <Button
                                                                variant="outlined"
                                                                sx={{ margin: 1, color: '#673AB7', backgroundColor: '#EDE7F6' }}
                                                                onClick={HandleSubmit}
                                                                disabled={
                                                                    formData.nom_boutique !== '' &&
                                                                    formData.date_debut !== '' &&
                                                                    formData.date_fin !== ''
                                                                        ? false
                                                                        : true
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
            title={`Listes des ${formData.type} de    ${formData.nom_boutique} du ${formData.date_debut} au ${formData.date_fin}`}
            data={ventes}
            columns={formData.type === 'ventes' ? columnsVentes : columnsFrais}
            options={options}
        />
    );
    return result;
};

export default FormInventaire;
