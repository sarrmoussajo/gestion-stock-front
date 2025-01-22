/* eslint-disable no-unused-vars */
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import API from 'utils/api';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
//import { useNavigate } from 'react-router';
import api from 'utils/api';
import AuthUser from '../authentication3/AuthUser';
import useScriptRef from 'hooks/useScriptRef';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    //const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    // const customization = useSelector((state) => state.customization);
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { setToken } = AuthUser();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Connectez-vous!</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    login: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    login: Yup.string().max(255).required('Le login est obligatoire'),
                    password: Yup.string().max(255).required('Le mot de passe est obligatoire')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setSubmitting(true);
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                        }
                        const formData = new FormData();
                        formData.append('login', values.login);
                        formData.append('password', values.password);
                        const response = await API.post('connexion', formData);
                        const { data, status, token } = response.data;
                        setSubmitting(false);
                        if (status === 'success') {
                            setToken(data[0], token);
                            if (data.profil === 'Admin') {
                                return navigate('/dashboard/admin');
                            } else if (data.profil === 'Super Admin') {
                                return navigate('/entity/index');
                            } else if (data.profil === 'Caissier') {
                                return navigate('/dashboard/caissier');
                            } else if (data.profil === 'Gerant') {
                                return navigate('/dashboard/gerant');
                            }
                        } else {
                            const { message } = response.data;
                            setErrors({ submit: message });
                        }
                    } catch (err) {
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleSubmit, handleChange, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.login && errors.login)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Login</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="text"
                                value={values.login}
                                name="login"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="login"
                                inputProps={{}}
                            />
                            {touched.login && errors.login && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.login}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Mot de passe</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="mot de passe"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    //disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Se connecter
                                </Button>
                            </AnimateButton>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', direction: 'row', justifyContent: 'center' }}>
                            {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}
                            {isSubmitting && <CircularProgress />}
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
