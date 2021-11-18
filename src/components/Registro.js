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
import { Controller, useForm } from "react-hook-form";



const defaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
}

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

    // React hook form
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues });


    function handleChange(e) {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    function originalSubmit(e) {

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

    // Mensajes de validación
    const nameErrorText = (errors) => {
        if (errors.name?.type === "required") {
            return env("REQUIRED_FIELD_ERROR_TEXT")
        }
    }
    const emailErrorText = (errors) => {
        if (errors.email?.type === "required") {
            return env("REQUIRED_FIELD_ERROR_TEXT")
        }
        else if (errors.email?.type === "pattern") {
            return env("EMAIL_ERROR_TEXT")
        }
    }
    const passwordErrorText = (errors) => {
        if (errors.password?.type === "required") {
            return env("REQUIRED_FIELD_ERROR_TEXT")
        }
        else {
            return "La contraseña debe tener como mínimo 6 caracteres"
        }
    }
    const confirmPasswordErrorText = (errors) => {
        if (errors.confirmPassword?.type === "required") {
            return env("REQUIRED_FIELD_ERROR_TEXT")
        }
        else {
            return "La contraseña debe tener como mínimo 6 caracteres"
        }
    }

    return (
        <>
            <Box>
                <p>
                    Ingresá los siguientes datos para poder registrarte en el sistema:
                </p>
            </Box>
            <Box>
                <form
                    // Con handlesubmit de hook-form se valida, después invoca al submit original
                    onSubmit={handleSubmit(originalSubmit)}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            name="name"
                                            id="name"
                                            placeholder="Ej: Juan Gonzalez"
                                            label="Nombre completo"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            helperText={nameErrorText(errors)}
                                            error={errors.name && true}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: true, pattern: {value: /\S+@\S+\.\S+/} }}
                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            name="email"
                                            id="email"
                                            //type="email"
                                            placeholder="Ej: juan@gmail.com"
                                            label="Email"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailOutlineIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            error={errors.email && true}
                                            helperText={emailErrorText(errors)}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: true, minLength: 6 }}
                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
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
                                            helperText={passwordErrorText(errors)}
                                            error={errors.password && true}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{ required: true, minLength: 6 }}
                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            name="password_confirmation"
                                            id="password_confirmation"
                                            placeholder=""
                                            label="Ingresá de vuelta la contraseña para confirmar"
                                            type="password"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKeyIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            error={errors.confirmPassword && true}
                                            helperText={confirmPasswordErrorText(errors)}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
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
                </form>
            </Box>
        </>
    );
}