import { React, useState } from "react";

import { InputAdornment, Grid, Box, Alert, FormControl, Button, TextField, IconButton, Tooltip } from "@mui/material";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person';

import "assets/css/login.css";

import env from "@beam-australia/react-env";
import { useHistory } from "react-router";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { MyAlert } from "./MyAlert";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useCookies } from 'react-cookie';


// Valores default del form
const defaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
}

// Schema de Yup para las validaciones
// - con el env() pongo el mensaje de error
const schema = yup.object({
    name: yup.string().required(env("REQUIRED_FIELD_ERROR_TEXT")),
    email: yup.string().email(env("EMAIL_ERROR_TEXT")).required(env("REQUIRED_FIELD_ERROR_TEXT")),
    password: yup.string().required(env("REQUIRED_FIELD_ERROR_TEXT")).min(6, "Debe contener como mínimo 6 caracteres"),
    confirmPassword: yup
        .string()
        .required(env("REQUIRED_FIELD_ERROR_TEXT"))
        .min(6, "Debe contener como mínimo 6 caracteres")
        .oneOf([yup.ref('password'), null], env("PASSWORD_MATCH")),
}).required(env("REQUIRED_FIELD_ERROR_TEXT"));

export default function Registro(props) {

    // React-cookie
    const [cookies, setCookie] = useCookies();
    
    const history = useHistory();

    const [state, setState] = useState(
        {
            email: '',
            password: '',
            password_confirmation: '',
            name: '',

            errorEmail: false,
            textoErrorEmail: '',
        }
    )

    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

    // React hook form
    const { control, handleSubmit, formState: { errors }, getValues, watch, trigger } = useForm({
        defaultValues,
        resolver: yupResolver(schema) // Le digo que use e resolver de yup
    });


    function originalSubmit(data, e) {

        let ruta = 'api/auth/register';

        let datos = {
            'name': data.name,
            'email': data.email,
            'password': data.password,
            'password_confirmation': data.confirmPassword
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

    function setearCookies(data) {
        setCookie('X-Bonita-API-Token', data.auth['X-Bonita-API-Token'], { path: '/' })
        setCookie("JSESSIONID", data.auth.JSESSIONID, { path: '/' });
        setCookie("access_token", data.auth.access_token, { path: '/' });
        setCookie("name", data.user.name, { path: '/' });
        setCookie("email", data.user.email, { path: '/' });
        setCookie("rol", data.user.roles[0], { path: '/' });
    }

    function registroExitoso() {
        let ruta = 'api/auth/login';

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'email': getValues("email"),
                'password': getValues("password")
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
        if (data.email) {
            emailError();
        }
    }

    function emailError() {
        setState(prevState => ({
            ...prevState,
            errorEmail: true,
            textoErrorEmail: "El email " + getValues("email") + " ya está en uso. Por favor, usá otro."
        }))
    }
    function cerrarErrorEmail() {
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
                                            // El message lo trae del resolver de Yup, seteado arriba de todo
                                            helperText={errors.name?.message}
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
                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            name="email"
                                            id="email"
                                            placeholder="Ej: juan@gmail.com"
                                            label="Email"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailOutlineIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            // El message lo trae del resolver de Yup, seteado arriba de todo
                                            helperText={errors.email?.message}
                                            error={errors.email && true}
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
                                    render={({
                                        field: { onChange }
                                    }) => (
                                        <TextField
                                            fullWidth
                                            name="password"
                                            id="password"
                                            placeholder=""
                                            label="Contraseña"
                                            type={mostrarPassword ? "text" : "password"}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKeyIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title={mostrarPassword ? "Ocultar contraseña" : "Revelar contraseña"}>
                                                            <IconButton
                                                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                                            >
                                                                {mostrarPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                )
                                            }}
                                            // El message lo trae del resolver de Yup, seteado arriba de todo
                                            helperText={errors.password?.message}
                                            error={errors.password && true}
                                            // Con esto triggereo manualmente la validación del password confirm para que sea mutuo:
                                            // si cambio este campo original también valida a ver si matchea con el otro
                                            onChange={e => {
                                                onChange(e);
                                                // Acá uso este condicional para que no chequee si todavía no se ingresó nada en el otro
                                                if (watch("confirmPassword") !== '') trigger("confirmPassword")
                                            }}
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
                                            type={mostrarConfirmPassword ? "text" : "password"}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKeyIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title={mostrarConfirmPassword ? "Ocultar contraseña" : "Revelar contraseña"}>
                                                            <IconButton
                                                                onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                                                            >
                                                                {mostrarConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                )
                                            }}
                                            // El message lo trae del resolver de Yup, seteado arriba de todo
                                            helperText={errors.confirmPassword?.message}
                                            error={errors.confirmPassword && true}
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
                                Registrarme
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            {/* Alert de email ya usado */}
            <MyAlert
                open={state.errorEmail}
                onClose={cerrarErrorEmail}
                title={state.textoErrorEmail}
                text=""
                severity="error"
                variant="filled"
            />
        </>
    );
}