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

import * as yup from "yup";
import { setLocale } from 'yup';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';


// Valores default del form
const defaultValues = {
    email: "",
    password: ""
}

// Schema de Yup para las validaciones
// - con el env() pongo el mensaje de error
const schema = yup.object({
    email: yup.string().email(env("EMAIL_ERROR_TEXT")).required(env("REQUIRED_FIELD_ERROR_TEXT")),
    password: yup.string().required(env("REQUIRED_FIELD_ERROR_TEXT")),
}).required(env("REQUIRED_FIELD_ERROR_TEXT"));


export default function Login(props) {

    const [alert, setAlert] = useState({
        mostrarAlert: false,
        alertTitle: '',
        alertText: '',
        alertSeverity: 'info',
        alertVariant: 'filled'
    })

    const history = useHistory();

    // React hook form
    const { control, handleSubmit, formState: { errors }, watch, getValues } = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });

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

    function originalSubmit(data, e) {

        let ruta = 'api/auth/login';

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'email': data.email,
                'password': data.password
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
                <form
                    // Con handlesubmit de hook-form se valida, después invoca al submit original
                    onSubmit={handleSubmit(originalSubmit)}
                >

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth={true}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth={true}
                                            name="email"
                                            id="email"
                                            placeholder="Ej: juan@gmail.com"
                                            label="Email"
                                            //type="email"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailOutlineIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            helperText={errors.email?.message}
                                            error={errors.email && true}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth={true}>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth={true}
                                            name="password"
                                            id="password"
                                            placeholder=""
                                            label="Contraseña"
                                            type="password"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKeyIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            helperText={errors.password?.message}
                                            error={errors.password && true}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        {/* Alert avisando que hay errores en los campos */}
                        {Object.entries(errors).length !== 0 &&
                            <Grid item xs={12}>
                                <Alert severity="error" variant="outlined"
                                    sx={{
                                        fontSize: '.8em'
                                    }}
                                >
                                    {(Object.entries(errors).length > 1) ?
                                        "Por favor, corregí los campos marcados en rojo y volvé a intentar."
                                        :
                                        "Por favor, corregí el campo marcado en rojo y volvé a intentar."
                                    }
                                </Alert>
                            </Grid>
                        }

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
                </form>
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