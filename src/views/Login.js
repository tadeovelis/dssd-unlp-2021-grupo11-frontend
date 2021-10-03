import { React, Component } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { Button, Container, TextField, FormControl, InputLabel, Box, InputAdornment, Grid, Typography } from "@material-ui/core";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import "assets/css/login.css";
import { Redirect } from "react-router";

import routes from 'routes.js';

import { rutaDelDashboardParaElRol } from "helpers/RedirectDashboard";


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

        fetch('http://localhost/' + ruta, {
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
                                                    helperText="Debe tener entre X y X caracteres"
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
                                    </Grid>
                                </Box>
                            </form>
                        </CardBody>
                    </Card></Container>
            </div>
        );
    }
}