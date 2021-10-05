import { React, Component } from "react";

import { Container, Grid, Paper, Divider, Typography, Box, Button, Snackbar, Alert, AlertTitle } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import LabelIcon from '@mui/icons-material/Label';

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

export default class MesaDeEntradasDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            solicitudes: null,
            solicitudesCargadas: false,

            solicitudesAsignadas: null,
            solicitudesAsignadasCargadas: false
        }

        this.asignarmeSolicitud = this.asignarmeSolicitud.bind(this);

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

    componentDidMount() {
        this.getSolicitudes();
        this.getSolicitudesAsignadas();
    }

    componentDidUpdate(prevProps) {
        /*
        if (this.props.location.state.refreshTramites !== prevProps.location.state.refreshTramites) {
          this.getTramitesEnCurso();
        }
        */
    }

    getSolicitudes() {
        let ruta = 'api/availableEmployeeTasks';

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
                    solicitudes: data,
                    solicitudesCargadas: true
                }, () => {
                    console.log("Solicitudes");
                    console.log(this.state.solicitudes)
                })
            })
            .catch(error => console.error(error));
    }

    getSolicitudesAsignadas() {
        let ruta = 'api/employeeTasks';

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
                    solicitudesAsignadas: data,
                    solicitudesAsignadasCargadas: true
                }, () => {
                    console.log("Solicitudes asignadas");
                    console.log(this.state.solicitudesAsignadas)
                })
            })
            .catch(error => console.error(error));
    }

    asignarmeSolicitud(solicitud) {
        let ruta = 'api/assignTask/' + solicitud.id;

        fetch('http://localhost/' + ruta, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + this.props.location.state.data.auth.access_token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Response de Asignarme solicitud");
                console.log(data);
                this.getSolicitudesAsignadas();
                this.getSolicitudes();
            })
            .catch(error => console.error(error));
    }
    desasignarmeSolicitud(solicitud) {
        let ruta = 'api/unassignTask/' + solicitud.id;

        fetch('http://localhost/' + ruta, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + this.props.location.state.data.auth.access_token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.getSolicitudesAsignadas();
                this.getSolicitudes();
            })
            .catch(error => console.error(error));
    }

    mostrarSolicitudes() {
        return this.state.solicitudes.map((s) =>
            <Grid item xs={12}>
                <Box>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <LabelIcon color='info' />
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="body1"
                            >
                                {s.name} Nro. {s.caseId}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={this.asignarmeSolicitud.bind(this, s)}>
                                Evaluar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        )
    }
    mostrarSolicitudesAsignadas() {
        return this.state.solicitudesAsignadas.map((s) =>
            <Grid item xs={12}>
                <Box>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <LabelIcon color='info' />
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="body1"
                            >
                                {s.name} Nro. {s.caseId}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={this.desasignarmeSolicitud.bind(this, s)}>
                                Desasignar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        )
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
                        <Grid item xs={12}>
                            <Paper className="dashboard-paper">
                                <Typography
                                    sx={{
                                        fontSize: 20
                                    }}
                                >
                                    Listado de solicitudes <b>pendientes</b> para evaluar (nuevas o con corrección)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >
                                    Cuando hagas click en "Evaluar" se te asignará la solicitud y podrás ver toda la información de la misma.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    {this.state.solicitudesCargadas && (this.state.solicitudes.length !== 0) ?
                                        this.mostrarSolicitudes()
                                        :
                                        <Grid item><span>No hay ninguna solicitud para evaluar</span></Grid>
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className="dashboard-paper">
                                <Typography
                                    sx={{
                                        fontSize: 20
                                    }}
                                >
                                    Listado de solicitudes <b>tomadas</b> para evaluar (nuevas o con corrección)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >
                                    Cuando hagas click en "Desasignar" se te desasignará la solicitud para que otro usuario la pueda evaluar.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    {this.state.solicitudesAsignadasCargadas && (this.state.solicitudesAsignadas.length !== 0) ?
                                        this.mostrarSolicitudesAsignadas()
                                        :
                                        <Grid item><span>No tenés asignada ninguna solicitud.</span></Grid>
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        )
    }
}
