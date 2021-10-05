import { React, Component } from "react";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import { Container, TextField, Divider, FormControl, InputLabel, InputAdornment, Grid, Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import "assets/css/login.css";

import Registro from './Registro.js';

import env from "@beam-australia/react-env";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loginExitoso = this.loginExitoso.bind(this);
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
            })})
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
        //let ruta = rutaDelDashboardParaElRol(data.user.roles[0].name);
        // Agarra el nombre del rol y usa eso para la ruta
        let ruta = '/' + data.user.roles[0] + '/inicio';
        this.props.history.push({
            pathname: ruta,
            state: { data: data } 
        });
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
                                Ingresá tu email y contraseña para poder ingresar al sistema
                            </p>
                            <form onSubmit={this.handleSubmit}>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth={true}>
                                                <TextField
                                                    name="email"
                                                    id="email"
                                                    placeholder="Ej: jorge@gmail.com"
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
                                            <Divider sx={{
                                                mt: 2
                                            }}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <p>Si todavía no tenés una cuenta, registrate haciendo click <Link to="/registro">
                                                 aquí.
                                            </Link></p>
                                            
                                        </Grid>
                                    </Grid>
                                </Box>
                            </form>
                        </CardBody>
                    </Card></Container>
            </div>
        );
    }
}