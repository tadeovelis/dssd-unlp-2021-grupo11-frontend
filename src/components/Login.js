import { React, Component, useState } from "react";

import { TextField, Snackbar, Alert, AlertTitle, Divider, FormControl, InputAdornment, Grid, Typography } from "@mui/material";
import { Box, Button } from "@mui/material";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import "assets/css/login.css";

import env from "@beam-australia/react-env";
import { setearCookies } from "helpers/helpers.js";
import { useHistory } from "react-router";


export default function Login(props) {

    const [state, setState] = useState({ email: '', password: '' });
    const [mostrarAlertLogoutExitoso, setMostrarAlertLogoutExitoso] = useState(false);
    const history = useHistory();

    function noMostrarAlertLogoutExitoso() {
        setMostrarAlertLogoutExitoso(false)
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
                if (data.error) alert("Datos incorrectos")
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
                    Ingresá tu email y contraseña para poder ingresar al sistema:
                </p>
            </Box>
            <Box
                sx={{
                    mr: 6
                }}>
                <form onSubmit={handleSubmit}>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth={true}>
                                <TextField
                                    name="email"
                                    id="email"
                                    placeholder="Ej: juan@gmail.com"
                                    label="Email"
                                    required={true}
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
                                <TextField
                                    name="password"
                                    id="password"
                                    placeholder=""
                                    label="Contraseña"
                                    type="password"
                                    required
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
                </form>
            </Box>
        </>
    );
}