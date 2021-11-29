import { React, Component } from "react";

import { Container, Accordion, AccordionSummary, CircularProgress, Chip, AccordionDetails, Grid, Paper, Divider, Typography, Box, Button, Snackbar, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

import LabelIcon from '@mui/icons-material/Label';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import '../assets/css/dashboard.css'

import env from "@beam-australia/react-env";

import { getCookie } from '../helpers/helpers';

import { MostrarSociedad } from "components/MostrarSociedad";
import { withCookies } from "react-cookie";


class MesaDeEntradasDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // access_token desde las cookies|
            access_token: this.props.cookies.get('access_token'),

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
            abrirDialogoCarpeta: false,
            textoDialogoConfirmacion: '',
            textoBotonConfirmacion: '',
            accionBotonConfirmacion: ''
        }

        this.asignarmeSolicitud = this.asignarmeSolicitud.bind(this);
        this.handleInfoSociedad = this.handleInfoSociedad.bind(this);
        this.handleCloseDialogoConfirmacion = this.handleCloseDialogoConfirmacion.bind(this);
        this.handleOpenDialogoConfirmacion = this.handleOpenDialogoConfirmacion.bind(this);
        this.handleCloseDialogoCarpeta = this.handleCloseDialogoCarpeta.bind(this);
        this.handleOpenDialogoCarpeta = this.handleOpenDialogoCarpeta.bind(this);
        this.noMostrarAlert = this.noMostrarAlert.bind(this);

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
            texto = '¿Estás seguro que querés aprobar la solicitud?';
            textoBoton = 'Aprobar';
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

    handleCloseDialogoCarpeta() {
        this.setState({ abrirDialogoCarpeta: false })
    }

    handleOpenDialogoCarpeta(solicitud, sociedad, accion) {
        const texto = '¿Estás seguro que querés marcar la carpeta como creada y finalizar el registro?';
        const textoBoton = 'Crear';

        this.setState({
            textoDialogoConfirmacion: texto,
            textoBotonConfirmacion: textoBoton,
            accionBotonConfirmacion: accion,
            solicitudAConfirmar: solicitud,
            sociedadAConfirmar: sociedad
        }, () => this.setState({ abrirDialogoCarpeta: true }))
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
                'Authorization': 'Bearer ' + this.state.access_token
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
                'Authorization': 'Bearer ' + this.state.access_token
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
            let ruta = 'api/sociedadAnonimaByCaseId/' + this.state.solicitudesAsignadas[i].caseId;

            fetch(env("BACKEND_URL") + ruta, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + this.state.access_token
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
                    'Authorization': 'Bearer ' + this.state.access_token
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
                    'Authorization': 'Bearer ' + this.state.access_token
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
                'Authorization': 'Bearer ' + this.state.access_token
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

    crearCarpeta(accion) {
        let ruta = 'api/carpetaFisica/' + this.state.solicitudAConfirmar.id;

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + this.state.access_token
            }
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
        let texto = "";
        switch (accion) {
            case "true":
                texto = 'Aprobaste la solicitud correctamente'
                break;
            case "false":
                texto = 'Rechazaste la solicitud correctamente'
                break;
            case "true-carpeta":
                texto = 'Creaste la carpeta correctamente'
                break;
        }

        this.setState({
            textoAlertAprobacionORechazoExitoso: texto
        }, () => {
            this.setState({
                mostrarAlertAprobacionORechazoExitoso: true,
                abrirDialogoConfirmacion: false,
                abrirDialogoCarpeta: false,
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
                                Asignar
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
                                    {s.displayName == 'Creación de carpeta física' ?
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleOpenDialogoCarpeta.bind(this, s, this.state['sociedad' + s.caseId], "true-carpeta")}>
                                            Crear carpeta
                                        </Button>
                                        :
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleOpenDialogoConfirmacion.bind(this, s, this.state['sociedad' + s.caseId], "true")}>
                                            Aceptar solicitud
                                        </Button>
                                    }
                                </Grid>
                                {s.displayName != 'Creación de carpeta física' &&
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={this.handleOpenDialogoConfirmacion.bind(this, s, this.state['sociedad' + s.caseId], "false")}>
                                            Rechazar solicitud
                                        </Button>
                                    </Grid>
                                }
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
            <MostrarSociedad
                sociedad={s}
                rol={env("ROL_MESA_ENTRADAS")}
            />
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

    mostrarEstados(sociedad) {
        return sociedad.estados.map((e) =>
            <Grid key={e.id} item xs={12}>
                <b>Nombre {e.name} - País {e.pais} - Continente {e.continente}</b>
            </Grid>
        )
    }

    render() {

        // Acá me traigo el response del login
        const user = this.props.cookies.get("name");

        return (
            <Container>
                <Box p={2}>
                    <Grid container spacing={2}>
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
                                    Listado de tareas <b>disponibles</b> para asignar
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >
                                    Cuando hagas click en "Asignar" se te asignará la tarea y podrás ver toda la información de la misma.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    {this.state.solicitudesCargadas && (this.state.solicitudes.length !== 0) ?
                                        this.mostrarSolicitudes()
                                        :
                                        <Grid item><span>No hay ninguna tarea para asignar.</span></Grid>
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
                                    Listado de tareas <b>tomadas</b> para realizar
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >
                                    Cuando hagas click en "Desasignar" se te desasignará la tarea y estará disponible nuevamente.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    {(!this.state.solicitudesAsignadasCargadas || !this.state.sociedadesCargadas) ?
                                        <CircularProgress />
                                        :
                                        (this.state.solicitudesAsignadas.length !== 0) ?
                                            this.mostrarSolicitudesAsignadas()
                                            :
                                            <Grid item><span>No tenés asignada ninguna tarea.</span></Grid>
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

                {/* Diálogo de confirmación de creación de carpeta */}
                <Dialog
                    open={this.state.abrirDialogoCarpeta}
                    onClose={this.handleCloseDialogoCarpeta}
                >
                    <DialogTitle>Confirmar operación</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.textoDialogoConfirmacion + ' '}
                            Es la solicitud nro. <b>{this.state.solicitudAConfirmar.id}</b>,
                            para marcar la creación de carpeta física de
                            la Sociedad Anónima <b>{this.state.sociedadAConfirmar.nombre}</b>.
                            Esta operación es irreversible.
                        </DialogContentText>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.crearCarpeta.bind(this, this.state.accionBotonConfirmacion)}
                            >
                                {this.state.textoBotonConfirmacion}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={this.handleCloseDialogoCarpeta}
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

export default withCookies(MesaDeEntradasDashboard)
