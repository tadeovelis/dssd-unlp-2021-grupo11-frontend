import { React, Component } from "react";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import { Container, TextField, Snackbar, Alert, AlertTitle, Divider, FormControl, InputLabel, InputAdornment, Grid, Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import "assets/css/login.css";

import env from "@beam-australia/react-env";
import { setearCookies } from "helpers/helpers.js";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

            mostrarAlertLogoutExitoso: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loginExitoso = this.loginExitoso.bind(this);
        this.noMostrarAlertLogoutExitoso = this.noMostrarAlertLogoutExitoso.bind(this);
    }

    /*
    componentDidMount(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.location.state && this.props.location.state.logoutExitoso) {
                this.setState({
                    mostrarAlertLogoutExitoso: true
                })
            }
        }
    }
    */

    noMostrarAlertLogoutExitoso() {
        this.setState({
            mostrarAlertLogoutExitoso: false
        })
    }

    handleSubmit(e) {
        let ruta = 'api/auth/login';

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'email': this.state.email,
                'password': this.state.password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) alert("Datos incorrectos")
                else {
                    console.log(data);
                    this.loginExitoso(data);
                }
            })
            .catch(error => console.error(error));

        e.preventDefault();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    loginExitoso(data) {

        // Seteo las cookies
        setearCookies(data);

        // Agarra el nombre del rol y usa eso para la ruta
        let ruta = '/' + data.user.roles[0] + '/inicio';
        this.props.history.push({
            pathname: ruta,
            state: { data: data }
        });
    }

    render() {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#f1f6f7',
                    px: 8,
                    py: 16,
                    boxShadow: 3,
                    mr: 4
                }}
            >
                <Box>
                    <span className="login-title">Iniciá sesión y empezá a operar</span><br />
                </Box>
                <Box>
                    <p>
                        Ingresá tu email y contraseña para poder ingresar al sistema
                    </p>
                </Box>
                <Box
                    sx={{
                        mr: 6
                    }}>
                    <form onSubmit={this.handleSubmit}>

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
                                        value={this.state.email}
                                        onChange={this.handleChange}
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
                                        required={true}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <VpnKeyIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                        value={this.state.password}
                                        onChange={this.handleChange}
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
                                    o, si todavía no tenés cuenta
                                </Divider>
                            </Grid>
                            <Grid item xs={12}>
                                <p>registrate haciendo click <Link to="/registro">
                                    aquí.
                                </Link></p>

                            </Grid>
                        </Grid>

                    </form>
                </Box>

                {/* Alert de logout exitoso */}
                <Snackbar
                    open={this.state.mostrarAlertLogoutExitoso}
                    onClose={this.noMostrarAlertLogoutExitoso}
                    sx={{ width: '80%' }}
                    spacing={2}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        variant="filled"
                        onClose={this.noMostrarAlertLogoutExitoso}
                        closeText={'Cerrar'}
                    >
                        <AlertTitle>Te deslogueaste correctamente</AlertTitle>
                    </Alert>
                </Snackbar>

            </Box>
        );
    }
}