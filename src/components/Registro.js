import { React, Component, useState, useEffect } from "react";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import { Container, TextField, FormControl, InputLabel, InputAdornment, Grid, Typography, Alert } from "@mui/material";
import { Box, Button } from "@mui/material";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person';

import "assets/css/login.css";

import env from "@beam-australia/react-env";
import { setearCookies } from "helpers/helpers";
import { useHistory } from "react-router";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";


export default function Registro(props) {

    const history = useHistory();

    const [state, setState] = useState(
        {
            email: '',
            password: '',
            password_confirmation: '',
            name: '',

            errorEmail: false,
            textoErrorEmail: ''
        }
    )

    const [huboErrores, setHuboErrores] = useState(false);
    const [cantErrores, setCantErrores] = useState(0);

    // Agregar custom validator para la confirmación de contraseña
    useEffect(() => {
        ValidatorForm.addValidationRule('confirmacionPasswordMatchea', (valor) => {
            if (valor !== state.password_confirmation) {
                console.log(valor);
                console.log(state.password_confirmation);
                return false
            }
            return true
        });
        return () => {
            ValidatorForm.removeValidationRule('confirmacionPasswordMatchea')
        }
    }, [])

    function handleChange(e) {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    function handleSubmit(e) {
        resetEmailError();
        let ruta = 'api/auth/register';

        let datos = {
            'name': state.name,
            'email': state.email,
            'password': state.password,
            'password_confirmation': state.password_confirmation
        }

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => response.json()
            .then(data => {
                if (response.ok) {
                    registroExitoso(data);
                }
                else mostrarError(data)
            }))
            .catch(error => console.error(error));

        e.preventDefault();
    }

    function registroExitoso() {
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

                // Seteo las cookies
                setearCookies(data);

                let ruta = '/' + data.user.roles[0] + '/inicio';
                history.push({
                    pathname: ruta,
                    state: { data: data, primerInicio: true }
                });
            })
            .catch(error => console.error(error));
    }

    function mostrarError(data) {
        setCantErrores(1);
        setHuboErrores(true);
        if (data.email) {
            emailError();
        }
    }

    function emailError() {
        setState(prevState => ({
            ...prevState,
            errorEmail: true,
            textoErrorEmail: "El email " + state.email + " ya está en uso. Por favor, usá otro."
        }))
    }
    function resetEmailError() {
        setState(prevState => ({
            ...prevState,
            errorEmail: false,
            textoErrorEmail: ""
        }))
    }

    return (
        <>
            <Box>
                <p>
                    Ingresá los siguientes datos para poder registrarte en el sistema:
                </p>
                <p>{state.password} | {state.password_confirmation}</p>
            </Box>
            <Box>
                <ValidatorForm
                    onSubmit={handleSubmit}
                    instantValidate={false}
                    onError={(errores) => {
                        setCantErrores(errores.length);
                        setHuboErrores(true)
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextValidator
                                    fullWidth
                                    name="name"
                                    id="name"
                                    placeholder="Ej: Juan Gonzalez"
                                    label="Nombre completo"
                                    validators={['required']}
                                    errorMessages={[env("REQUIRED_FIELD_ERROR_TEXT")]}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    value={state.name}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextValidator
                                    fullWidth
                                    name="email"
                                    id="email"
                                    //type="email"
                                    placeholder="Ej: juan@gmail.com"
                                    label="Email"
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
                                    error={state.errorEmail}
                                    helperText={state.textoErrorEmail}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextValidator
                                    fullWidth
                                    name="password"
                                    id="password"
                                    placeholder=""
                                    label="Contraseña"
                                    type="password"
                                    validators={['required', 'minStringLength:6']}
                                    errorMessages={[env("REQUIRED_FIELD_ERROR_TEXT"), 'Debe tener como mínimo 6 caracteres']}
                                    helperText="Debe tener como mínimo 6 caracteres"
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
                            <FormControl fullWidth>
                                <TextValidator
                                    fullWidth
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    placeholder=""
                                    label="Ingresá de vuelta la contraseña para confirmar"
                                    type="password"
                                    validators={['required', 'minStringLength:6', 'confirmacionPasswordMatchea']}
                                    errorMessages={[env("REQUIRED_FIELD_ERROR_TEXT"), 'Debe tener como mínimo 6 caracteres', 'Las contraseñas no coinciden']}
                                    helperText="Debe tener como mínimo 6 caracteres"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    value={state.password_confirmation}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>
                        {huboErrores &&
                            <Grid item xs={12}>
                                <Alert severity="error" variant="outlined"
                                    onClose={
                                        () => setHuboErrores(false)
                                    }
                                    sx={{
                                        fontSize: '.8em'
                                    }}
                                >
                                    {(cantErrores > 1) ?
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
                                Registrarme
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Box>
        </>
    );
}