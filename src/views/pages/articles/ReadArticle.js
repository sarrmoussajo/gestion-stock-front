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
    TextField,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Typography,
    TablePagination,
    TableFooter,
    Grid,
    styled,
    CircularProgress,
    Box,
    Chip,
    Badge
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import API from 'utils/api';
import { isEmptyArray } from 'formik';
import { useEffect } from 'react';
import AuthUser from 'views/pages/authentication/authentication3/AuthUser';
import { color, display } from '@mui/system';

const ReadArticle = () => {
    const { place, id } = useParams();
    const location = useLocation();
    const alert = location.state ? location.state.alert : '';
    const [depots, setDepots] = useState([]);
    const [itemLocal, setItemLocal] = useState();
    const [depot, setDepot] = useState();
    const [formData, setFormData] = useState({ quantite: '', nom_depot: '' });
    const [open, setOpen] = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [errors, setErrors] = useState({});
    const [index, setIndex] = useState();
    const [articles, setArticles] = useState([]);
    const [message, setMessage] = useState(alert);
    const { user } = AuthUser();
    const [profil, setProfil] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [spinner, setSpinner] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            async function getArticles() {
                var response;
                if (user.profil === 'Caissier') {
                    response = await API.post('articles-boutique', {
                        boutique_id: user.affectation
                    });
                    setProfil('Caissier');
                } else if (user.profil === 'Gerant') {
                    if (place === 'boutique') {
                        response = await API.post('articles-boutique', {
                            boutique_id: id
                        });
                        setProfil('Caissier');
                    } else {
                        response = await API.post('articles-depot', {
                            depot_id: user.affectation
                        });
                        setProfil('Gerant');
                    }
                } else if (user.profil === 'Admin') {
                    if (place === 'boutique') {
                        response = await API.post('articles-boutique', {
                            boutique_id: id
                        });
                        setProfil('Caissier');
                    } else if (place === 'depot') {
                        response = await API.post('articles-depot', {
                            depot_id: id
                        });
                        setProfil('Gerant');
                    }
                }
                const { data, status } = response.data;
                setArticles(data);
            }
            getArticles();
            setSpinner(false);
        } catch (error) {
            console.log(error);
        }
    }, [id, place, user.affectation, user.profil]);
    useEffect(() => {
        try {
            async function getDepot() {
                const response = await API.get(`depot`);
                const { data, status } = response.data;
                setDepots(data);
            }
            async function getLocalData() {
                if (user.profil === 'Admin') {
                    const response = await API.get(`${place}/${id}`);
                    if (place === 'boutique') {
                        const { data, status } = response;
                        setItemLocal(data);
                    } else if (place === 'depot') {
                        const { data, status } = response.data;
                        setItemLocal(data);
                    }
                }
            }
            getDepot();
            getLocalData();
        } catch (error) {
            console.log(error);
        }
    }, [id, place, user.profil]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({});
    }

    function handleDelete() {
        setOpen(!open);
        try {
            async function deleteDepot() {
                const response = await API.delete(`depot/${index}`);
                const { message, status } = response.data;
                setMessage(message);
                const newDepotList = articles.filter((depot) => {
                    return depot.id !== index;
                });
                setArticles(newDepotList);
            }
            deleteDepot();
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeDialog = () => {
        setOpenReturn(!openReturn);
        setErrors({});
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeArticleTab = () => {
        const currentArticle = articles.find((item) => item.nom_article === depot.nom_article);
        if (currentArticle) {
            const quantiteRestant = parseInt(depot.quantite_boutique) - parseInt(formData.quantite);
            const filterCurrentArticle = articles.filter((item) => item.nom_article !== depot.nom_article);
            setArticles([
                ...filterCurrentArticle,
                {
                    ...depot,
                    quantite_boutique: quantiteRestant
                }
            ]);
        }
    };

    const handleSubmit = () => {
        try {
            async function returnArticle() {
                const response = await API.post(`retourner-article`, {
                    article_id: depot.article_id,
                    boutique_id: user.affectation,
                    quantite: formData.quantite,
                    depot_id: formData.nom_depot,
                    user_id: user.id
                });
                const { status, message } = response.data;
                if (status === 'success') {
                    setMessage(message);
                    handleChangeDialog();
                    handleChangeArticleTab();
                } else {
                    setErrors({ ...errors, message: message });
                }
            }
            returnArticle();
        } catch (error) {
            console.log(error);
        }
    };

    function toUpdate(id) {
        return navigate(`/depot/article/edit/${id}`);
    }

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.h2,
        textAlign: 'left',
        height: 60,
        lineHeight: '60px',
        marginBottom: 20,
        paddingLeft: 15
    }));

    var nomLocal;
    if (place === 'boutique') {
        nomLocal = itemLocal?.nom_boutique;
    } else if (place === 'depot') {
        nomLocal = itemLocal?.nom_depot;
    }

    const [timeOut, setTimeOut] = useState(0);
    setTimeout(() => {
        setTimeOut(1);
    }, 5000);
    return (
        <>
            <Grid item xs={8}>
                <Item elevation={0}>{user.profil === 'Admin' ? `${nomLocal || ''} : Liste Articles  ` : 'Liste Articles'}</Item>
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
                        <DialogContentText id="alert-dialog-description">êtes-vous sûr de vouloir supprimer le dépot ?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Annuler</Button>
                        <Button onClick={() => handleDelete()}>Confirmer</Button>
                    </DialogActions>
                </Dialog>
            ) : null}

            {!isEmptyArray(articles) ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom Article</TableCell>
                                <TableCell>Référence</TableCell>
                                <TableCell>type</TableCell>
                                <TableCell>catégorie</TableCell>
                                <TableCell>Quantité</TableCell>
                                <TableCell>Marque</TableCell>
                                <TableCell>Prix</TableCell>
                                {user.profil !== 'Admin' && <TableCell>Action</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articles?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((depot) => (
                                <TableRow key={depot.id + depot.reference} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {depot.nom_article}
                                    </TableCell>
                                    {profil === 'Caissier' ? (
                                        <>
                                            <TableCell>{depot.reference}</TableCell>
                                            <TableCell>{depot.type}</TableCell>
                                            <TableCell>{depot.categorie}</TableCell>
                                            <TableCell sx={{ color: depot.quantite_boutique <= 5 && 'red' }}>
                                                {depot.quantite_boutique}
                                            </TableCell>
                                            <TableCell>{depot.marque}</TableCell>
                                            <TableCell>
                                                {depot.solde ? (
                                                    <Badge color="error" badgeContent={'soldé'}>
                                                        {depot.prix_vente} F CFA
                                                    </Badge>
                                                ) : (
                                                    depot.prix_vente + `F CFA`
                                                )}
                                            </TableCell>
                                            {user.profil !== 'Admin' && (
                                                <TableCell>
                                                    <Chip
                                                        label="Retourner"
                                                        // variant="outlined"
                                                        color="primary"
                                                        onClick={() => {
                                                            handleChangeDialog();
                                                            setDepot(depot);
                                                        }}
                                                        deleteIcon={<DeleteIcon />}
                                                    />
                                                </TableCell>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{depot.reference}</TableCell>
                                            <TableCell>{depot.type}</TableCell>
                                            <TableCell>{depot.categorie}</TableCell>
                                            <TableCell sx={{ color: depot.quantite_depot <= 5 && 'red' }}>{depot.quantite_depot}</TableCell>
                                            <TableCell>{depot.marque}</TableCell>
                                            <TableCell>
                                                {depot.solde ? (
                                                    <Badge color="error" badgeContent={'soldé'}>
                                                        {depot.prix_vente} F CFA
                                                    </Badge>
                                                ) : (
                                                    depot.prix + ` F CFA`
                                                )}
                                            </TableCell>
                                            {user.profil !== 'Admin' && (
                                                <TableCell>
                                                    <Chip
                                                        label="Modifier"
                                                        component="a"
                                                        href="#basic-chip"
                                                        //variant="outlined"
                                                        clickable
                                                        color="success"
                                                        onClick={() => {
                                                            toUpdate(depot.article_id);
                                                        }}
                                                    />
                                                    &nbsp;&nbsp;
                                                    {/* <Link
                                                        onClick={() => {
                                                            setOpen(true);
                                                            setIndex(depot.id);
                                                        }}
                                                    >
                                                        <DeleteIcon color="error"></DeleteIcon>
                                                    </Link>
                                                     */}
                                                </TableCell>
                                            )}
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    count={articles.length}
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
                        <h4>Aucun article pour le moment</h4>
                    </Box>
                )
            )}

            <Dialog open={openReturn}>
                <DialogTitle>Retouner Article vers Dépot</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <TextField
                            id="depot"
                            name="nom_depot"
                            select
                            label="depot"
                            //value={category}
                            onChange={handleInputChange}
                            variant="outlined"
                        >
                            {depots.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.nom_depot}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            id="name"
                            name="quantite"
                            label="Quantité"
                            type="number"
                            onChange={handleInputChange}
                            fullWidth
                            variant="standard"
                        />
                    </FormControl>
                    <Typography color={'red'}>{errors.message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleChangeDialog}>Cancel</Button>
                    <Button onClick={handleSubmit}>valider</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReadArticle;
