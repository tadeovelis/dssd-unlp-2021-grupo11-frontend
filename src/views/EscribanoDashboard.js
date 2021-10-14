import { React, Component } from "react";

import { Container, Accordion, AccordionSummary, CircularProgress, AccordionDetails, Grid, Paper, Divider, Typography, Box, Button, Snackbar, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

import LabelIcon from '@mui/icons-material/Label';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import '../assets/css/dashboard.css'

import env from "@beam-australia/react-env";

import { getCookie, textoEstadoDeEvaluacion, valorYColorLineaProgreso } from '../helpers/helpers';

import { Link } from "react-router-dom";

import LineaProgresoTramite from "./LineaProgresoTramite";



export default class EscribanoDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            solicitudes: null,
            solicitudesCargadas: false,

            solicitudesAsignadas: null,
            solicitudesAsignadasCargadas: false,

            abrirInfoSociedad: false,

            sociedadesCargadas: false,

            solicitudAConfirmar: '',
            sociedadAConfirmar: '',
            mostrarAlertAprobacionORechazoExitoso: false,
            textoAlertAprobacionORechazoExitoso: '',
            abrirDialogoConfirmacion: false,
            textoDialogoConfirmacion: '',
            textoBotonConfirmacion: '',
            accionBotonConfirmacion: ''
        }

        this.asignarmeSolicitud = this.asignarmeSolicitud.bind(this);
        this.handleInfoSociedad = this.handleInfoSociedad.bind(this);
        this.handleCloseDialogoConfirmacion = this.handleCloseDialogoConfirmacion.bind(this);
        this.handleOpenDialogoConfirmacion = this.handleOpenDialogoConfirmacion.bind(this);
        this.noMostrarAlert = this.noMostrarAlert.bind(this);

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

    handleInfoSociedad(panel) {
        console.log(panel);
        console.log(this.state.abrirInfoSociedad);
        this.state.abrirInfoSociedad !== panel ?
            this.setState({ abrirInfoSociedad: panel }) :
            this.setState({ abrirInfoSociedad: false })
    }

    handleCloseDialogoConfirmacion() {
        this.setState({ abrirDialogoConfirmacion: false })
    }

    handleOpenDialogoConfirmacion(solicitud, sociedad, accion) {
        let texto = '';
        let textoBoton = '';

        if (accion === "true") {
            texto = '¿Estás seguro que querés validar la solicitud?';
            textoBoton = 'Validar';
        }
        else {
            texto = '¿Estás seguro que querés rechazar la solicitud?';
            textoBoton = 'Rechazar';
        }

        this.setState({
            textoDialogoConfirmacion: texto,
            textoBotonConfirmacion: textoBoton,
            accionBotonConfirmacion: accion,
            solicitudAConfirmar: solicitud,
            sociedadAConfirmar: sociedad
        }, () => this.setState({ abrirDialogoConfirmacion: true }))
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

        fetch(env("BACKEND_URL") + ruta, {
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

        fetch(env("BACKEND_URL") + ruta, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getCookie("access_token")
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    solicitudesAsignadas: data,
                    solicitudesAsignadasCargadas: true
                }, () => {
                    // Obtener la sociedad asociada a la solicitud
                    if (this.state.solicitudesAsignadas.length) this.getSociedadesAsociadasASolicitudes()
                    else this.setState({ sociedadesCargadas: true })
                })
            })
            .catch(error => console.error(error));
    }

    getSociedadesAsociadasASolicitudes() {
        for (let i = 0; i < this.state.solicitudesAsignadas.length; i++) {
            console.log("A");
            let ruta = 'api/sociedadAnonimaByCaseId/' + this.state.solicitudesAsignadas[i].caseId;

            fetch(env("BACKEND_URL") + ruta, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + getCookie("access_token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    let soc = 'sociedad' + this.state.solicitudesAsignadas[i].caseId;
                    this.setState({
                        [soc]: data
                    }, () => {
                        console.log([soc]);
                        if (i === this.state.solicitudesAsignadas.length - 1) {
                            this.setState({ sociedadesCargadas: true })
                        }
                    })
                })
                .catch(error => console.error(error));
        }
    }

    asignarmeSolicitud(solicitud) {
        // Resetear estados de carga
        this.setState({
            solicitudesCargadas: false,
            sociedadesCargadas: false,
            solicitudesAsignadasCargadas: false
        }, () => {

            let ruta = 'api/assignTask/' + solicitud.id;

            fetch(env("BACKEND_URL") + ruta, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + getCookie("access_token")
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
        })
    }

    desasignarmeSolicitud(solicitud) {
        // Resetear estados de carga
        this.setState({
            solicitudesCargadas: false,
            sociedadesCargadas: false,
            solicitudesAsignadasCargadas: false
        }, () => {
            let ruta = 'api/unassignTask/' + solicitud.id;

            fetch(env("BACKEND_URL") + ruta, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + getCookie("access_token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.getSolicitudesAsignadas();
                    this.getSolicitudes();
                })
                .catch(error => console.error(error));
        })
    }

    aceptarORechazarSolicitud(accion) {
        let ruta = 'api/updateSociedadAnonimaStatus/' + this.state.solicitudAConfirmar.id;

        let formData = new FormData();
        formData.append('aprobado', accion);

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getCookie("access_token")
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.mostrarAlert(accion);
                this.getSolicitudesAsignadas();
                this.getSolicitudes();
            })
            .catch(error => console.error(error));
    }

    // Setea todo para mostrar el alert de aprobación o rechazo de solicitud
    mostrarAlert(accion) {
        let texto = (accion === "true")
            ? 'Validaste la solicitud correctamente' : 'Rechazaste la solicitud correctamente';

        this.setState({
            textoAlertAprobacionORechazoExitoso: texto
        }, () => {
            this.setState({
                mostrarAlertAprobacionORechazoExitoso: true,
                abrirDialogoConfirmacion: false,
            })
        })
    }

    noMostrarAlert() {
        this.setState({
            mostrarAlertAprobacionORechazoExitoso: false
        })
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

                    <Accordion
                        expanded={this.state.abrirInfoSociedad === 'panel' + s.id}
                        onChange={this.handleInfoSociedad.bind(this, 'panel' + s.id)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id="panel"
                        >
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
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleOpenDialogoConfirmacion.bind(this, s, this.state['sociedad' + s.caseId], "true")}>
                                        Validar estatuto
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={this.handleOpenDialogoConfirmacion.bind(this, s, this.state['sociedad' + s.caseId], "false")}>
                                        Rechazar estatuto
                                    </Button>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            {this.mostrarInfoSociedad(this.state['sociedad' + s.caseId])}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>
        )
    }

    mostrarInfoSociedad(s) {
        return (
            <Grid key={s.id} container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h6">{s.nombre}</Typography>
                </Grid>
                <Box sx={{ width: '100%', my: 1 }}>
                    <LineaProgresoTramite
                        height={10}
                        value={valorYColorLineaProgreso(s.estado_evaluacion).valor}
                        color={valorYColorLineaProgreso(s.estado_evaluacion).color.string}
                    />
                </Box>
                <Grid item xs={12}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#6783FF',
                            fontWeight: 800,
                            fontSize: 14,
                            mt: -1,
                        }}
                    >{textoEstadoDeEvaluacion(s, "escribano")}
                    </Typography>
                </Grid>
                <Grid item xs={7}>
                    <Typography sx={{ fontSize: 18 }}>
                        Datos generales
                    </Typography>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 1, width: '95%' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Email del apoderado: {s.email_apoderado}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Domicilio legal: {s.domicilio_legal}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Domicilio real: {s.domicilio_real}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Fecha de creación: {this.formatDate(s.fecha_creacion)}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: 18 }}>
                            Socios
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 1, width: '85%' }} />
                    </Grid>
                    {this.mostrarSocios(s)}
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: 18 }}>
                            Enlace a la carpeta de Drive con el estatuto
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 1, width: '95%' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Link to={{ pathname: s.url_carpeta_estatuto }} target="_blank">
                            {s.url_carpeta_estatuto}
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    mostrarSocios(sociedad) {
        return sociedad.socios.map((s) =>
            <Grid key={s.id} item xs={12}>
                <Typography
                    variant="body1"
                >
                    <b>{s.nombre} {s.apellido}
                    </b>, con un {s.porcentaje}% {s.id === sociedad.apoderado_id ? <Chip label="Apoderado" color="primary" variant="outlined" /> : '.'}
                </Typography>
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
                                    {(!this.state.solicitudesAsignadasCargadas || !this.state.sociedadesCargadas) ?
                                        <CircularProgress />
                                        :
                                        (this.state.solicitudesAsignadas.length !== 0) ?
                                            this.mostrarSolicitudesAsignadas()
                                            :
                                            <Grid item><span>No tenés asignada ninguna solicitud.</span></Grid>
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                        {/*<Button onClick={() => console.log(this.state.abrirInfoSociedad)}>Acordión</Button>*/}
                    </Grid>
                </Box>

                {/* Diálogo de confirmación de aprobación de solicitud */}
                <Dialog
                    open={this.state.abrirDialogoConfirmacion}
                    onClose={this.handleCloseDialogoConfirmacion}
                >
                    <DialogTitle>Confirmar operación</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.textoDialogoConfirmacion + ' '}
                            Es la solicitud nro. <b>{this.state.solicitudAConfirmar.id}</b>, para registrar
                            la Sociedad Anónima <b>{this.state.sociedadAConfirmar.nombre}</b>.
                            Esta operación es irreversible.
                        </DialogContentText>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.aceptarORechazarSolicitud.bind(this, this.state.accionBotonConfirmacion)}
                            >
                                {this.state.textoBotonConfirmacion}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={this.handleCloseDialogoConfirmacion}
                            >
                                Cancelar
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>

                {/* Alert de aprobación de solicitud exitosa */}
                <Snackbar
                    open={this.state.mostrarAlertAprobacionORechazoExitoso}
                    onClose={this.noMostrarAlert}
                    sx={{ width: '80%' }}
                    spacing={2}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        variant="filled"
                        onClose={this.noMostrarAlert}
                        closeText={'Cerrar'}
                    >
                        <AlertTitle>{this.state.textoAlertAprobacionORechazoExitoso}</AlertTitle>
                    </Alert>
                </Snackbar>

            </Container>
        )
    }
}
