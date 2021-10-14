import { React, Component } from "react";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import { Container, TextField, FormControl, InputLabel, InputAdornment, Grid, Typography } from "@mui/material";
import { Box, Button } from "@mui/material";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person';

import "assets/css/login.css";

import env from "@beam-australia/react-env";
import { setearCookies } from "helpers/helpers";


export default class Registro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            password_confirmation: '',
            name: '',

            errorEmail: false,
            textoErrorEmail: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.registroExitoso = this.registroExitoso.bind(this);
        this.mostrarError = this.mostrarError.bind(this);
        this.emailError = this.emailError.bind(this);
        this.resetEmailError = this.resetEmailError.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        this.resetEmailError();
        let ruta = 'api/auth/register';

        let datos = {
            'name': this.state.name,
            'email': this.state.email,
            'password': this.state.password,
            'password_confirmation': this.state.password_confirmation
        }

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message) this.registroExitoso(data);
                else this.mostrarError(data)
            })
            .catch(error => console.error(error));

        e.preventDefault();
    }

    registroExitoso() {
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

                // Seteo las cookies
                setearCookies(data.auth);
                
                let ruta = '/' + data.user.roles[0] + '/inicio';
                this.props.history.push({
                    pathname: ruta,
                    state: { data: data, primerInicio: true }
                });
            })
            .catch(error => console.error(error));
    }

    mostrarError(data) {
        if (data.email) {
            this.emailError();
        }
    }

    emailError() {
        this.setState({
            errorEmail: true,
            textoErrorEmail: "El email " + this.state.email + " ya está en uso. Por favor, usá otro."
        })
    }
    resetEmailError() {
        this.setState({
            errorEmail: false,
            textoErrorEmail: ''
        })
    }

    render() {
        return (
            <div>
                <Container>
                    <Card className="login-card">
                        <CardBody>
                            <span className="login-title">Sistema de Registro de Sociedad Anónima</span><br />
                            <span className="login-subtitle">Dirección Nacional de Personas Jurídicas</span><br />
                            <p>
                                Ingresá los siguientes datos para poder registrarte en el sistema
                            </p>
                            <form onSubmit={this.handleSubmit}>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth={true}>
                                                <TextField
                                                    name="name"
                                                    id="name"
                                                    placeholder="Ej: Juan Gonzalez"
                                                    label="Nombre completo"
                                                    required={true}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    value={this.state.name}
                                                    onChange={this.handleChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth={true}>
                                                <TextField
                                                    name="email"
                                                    id="email"
                                                    type="email"
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
                                                    error={this.state.errorEmail}
                                                    helperText={this.state.textoErrorEmail}
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
                                                    helperText="Debe tener como mínimo 6 caracteres"
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
                                            <FormControl fullWidth={true}>
                                                <TextField
                                                    name="password_confirmation"
                                                    id="password_confirmation"
                                                    placeholder=""
                                                    label="Ingresá de vuelta la contraseña para confirmar"
                                                    type="password"
                                                    required={true}
                                                    helperText="Debe tener como mínimo 6 caracteres"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <VpnKeyIcon />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    value={this.state.password_confirmation}
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
                                                Registrarme
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </form>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        );
    }
}