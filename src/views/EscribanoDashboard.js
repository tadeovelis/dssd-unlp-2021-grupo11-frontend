import { React, Component } from "react";

import { Container, Grid, Paper, Divider, Typography, Box, Button, Snackbar, Alert, AlertTitle } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import '../assets/css/dashboard.css'


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#6783FF' : '#308fe8',
    },
}));

export default class EscribanoDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    componentDidMount() {
        //this.getTramitesEnCurso();
    }

    componentDidUpdate(prevProps) {
        /*
        if (this.props.location.state.refreshTramites !== prevProps.location.state.refreshTramites) {
          this.getTramitesEnCurso();
        }
        */
    }

    getTramitesEnCurso() {
        let ruta = 'api/sociedadesAnonimas';

        fetch('http://localhost/' + ruta, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + this.props.location.state.data.auth.access_token
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    sociedades: data,
                    sociedadesCargadas: true
                })
            })
            .catch(error => console.error(error));
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }


    render() {

        // Acá me traigo el response del login
        const user = this.props.location.state.data.user;
        const auth = this.props.location.state.data.auth;

        return (
            <Container>
                <Box p={2}>
                    <Grid container spacing={2}>

                        <Grid item xs={12}>
                            <Box p={2}>
                                <span><b>Mis datos</b></span><br />
                                <span>Nombre de usuario: {user.name}</span><br />
                                <span>Email: {user.email}</span>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className="dashboard-paper">
                                <Typography variant="h6">¡Hola {user.name}!</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        )
    }
}
