import { React, Component, useState } from "react";

import { TextField, Snackbar, Alert, AlertTitle, Divider, FormControl, InputAdornment, Grid, Typography } from "@mui/material";
import { Box, Button } from "@mui/material";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import "assets/css/login.css";

import env from "@beam-australia/react-env";
import { setearCookies } from "helpers/helpers.js";
import { useHistory } from "react-router";
import { MyAlert } from "./MyAlert";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";


export default function Login(props) {

    const [state, setState] = useState({ email: '', password: '' });
    const [alert, setAlert] = useState({ 
        mostrarAlert: false,
        alertTitle: '',
        alertText: '',
        alertSeverity: 'info',
        alertVariant: 'filled'
    })
    const [mostrarAlertLogoutExitoso, setMostrarAlertLogoutExitoso] = useState(false);
    const history = useHistory();

    function noMostrarAlert() {
        setAlert(prevState => ({
            ...prevState,
            mostrarAlert: false
        }))
    }

    function mostrarAlertDatosErroneos() {
        setAlert({
            mostrarAlert: true,
            alertTitle: "Datos incorrectos",
            alertText: "Los datos ingresados no coinciden o no existen, verificalos y volvé a intentar.",
            alertSeverity: "error",
            alertVariant: "filled"
        })
    }

    function handleSubmit(e) {
        let ruta = 'api/auth/login';

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'email': state.email,
                'password': state.password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error === "Unauthorized") {
                    mostrarAlertDatosErroneos();
                }
                else {
                    console.log(data);
                    loginExitoso(data);
                }
            })
            .catch(error => console.error(error));

        e.preventDefault();
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState, [name]: value
        }))
    }

    function loginExitoso(data) {

        // Seteo las cookies
        setearCookies(data);

        // Agarra el nombre del rol y usa eso para la ruta
        let ruta = '/' + data.user.roles[0] + '/inicio';
        history.push({
            pathname: ruta,
            state: { data: data }
        });
    }

    return (
        <>
            <Box>
                <span className="login-title">Iniciá sesión y empezá a operar</span><br />
            </Box>
            <Box>
                <p>
                    Completá tu email y contraseña para poder ingresar al sistema:
                </p>
            </Box>
            <Box
                sx={{
                    mr: 6
                }}>
                <ValidatorForm
                    onSubmit={handleSubmit}
                    instantValidate={false}
                >

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth={true}>
                                <TextValidator
                                    fullWidth={true}
                                    name="email"
                                    id="email"
                                    placeholder="Ej: juan@gmail.com"
                                    label="Email"
                                    //type="email"
                                    validators={['required', 'isEmail']}
                                    errorMessages={[env("REQUIRED_FIELD_ERROR_TEXT"), env("EMAIL_ERROR_TEXT")]}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    value={state.email}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth={true}>
                                <TextValidator
                                    fullWidth={true}
                                    name="password"
                                    id="password"
                                    placeholder=""
                                    label="Contraseña"
                                    type="password"
                                    validators={['required']}
                                    errorMessages={[env("REQUIRED_FIELD_ERROR_TEXT")]}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    value={state.password}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"

                            >
                                Ingresar
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider
                                textAlign="left"
                                sx={{
                                    mt: 2,
                                    fontSize: 13
                                }}>
                                O, si todavía no tenés cuenta
                            </Divider>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    '&:hover': {
                                        cursor: "pointer",
                                        color: "primary.main"
                                    }
                                }}
                                onClick={props.setQuieroRegistrar}
                            >
                                registrate haciendo click aquí.
                            </Typography>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Box>

            {/* Alert de datos erróneos */}
            <MyAlert 
                open={alert.mostrarAlert}
                onClose={noMostrarAlert}
                title={alert.alertTitle}
                text={alert.alertText}
                severity={alert.alertSeverity}
                variant={alert.alertVariant}
            />
        </>
    );
}