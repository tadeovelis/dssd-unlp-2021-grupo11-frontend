import { React, Component } from "react";

import { Container, Grid, Paper, Divider, Typography, CircularProgress, Box, Button, Snackbar, Alert, AlertTitle, TextField, ListItemIcon, ListItemText, List, ListItem } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import EmailIcon from '@mui/icons-material/Email';
import Chip from '@mui/material/Chip';

import '../assets/css/dashboard.css'

import env from "@beam-australia/react-env";

import { getCookie, textoEstadoDeEvaluacion, valorYColorLineaProgreso } from '../helpers/helpers';

import LineaProgresoTramite from "./LineaProgresoTramite";


const formatosValidosEstatuto = 'application/pdf,' +
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
  'application/vnd.oasis.opendocument.text';


export default class ApoderadoDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mostrarAlertRegistroSAExitoso: false,
      primerInicio: false,
      alertPrimerInicio: false,

      sociedades: null,
      sociedadesCargadas: false,

      mostrarAlertCorreccionSAExitosa: false,

      mostrarAlertActualizacionEstatutoExitosa: false,
    }

    this.getTramitesEnCurso = this.getTramitesEnCurso.bind(this);
    this.noMostrarAlertRegistroSAExitoso = this.noMostrarAlertRegistroSAExitoso.bind(this);
    this.noMostrarAlertCorreccionSAExitosa = this.noMostrarAlertCorreccionSAExitosa.bind(this);
    this.noMostrarAlertActualizacionEstatutoExitosa = this.noMostrarAlertActualizacionEstatutoExitosa.bind(this);
    this.noMostrarAlertPrimerInicio = this.noMostrarAlertPrimerInicio.bind(this);

  }

  componentDidMount() {
    if (this.props.location.state.registroDeSAExitoso) {
      this.setState({
        mostrarAlertRegistroSAExitoso: true
      })
    }

    if (this.props.location.state.primerInicio) {
      this.setState({
        primerInicio: true,
        alertPrimerInicio: true
      })
    }

    if (this.props.location.state.correccionDeSAExitosa) {
      this.setState({
        mostrarAlertCorreccionSAExitosa: true
      })
    }

    this.getTramitesEnCurso();
  }

  componentDidUpdate(prevProps) {
    // Uso tipico (no olvides de comparar las props):
    if (this.props.location.state.refreshTramites !== prevProps.location.state.refreshTramites) {
      this.getTramitesEnCurso();
    }
  }

  noMostrarAlertRegistroSAExitoso() {
    this.setState({
      mostrarAlertRegistroSAExitoso: false
    })
  }
  noMostrarAlertCorreccionSAExitosa() {
    this.setState({
      mostrarAlertCorreccionSAExitosa: false
    })
  }
  noMostrarAlertActualizacionEstatutoExitosa() {
    this.setState({
      mostrarAlertActualizacionEstatutoExitosa: false
    })
  }
  noMostrarAlertPrimerInicio() {
    this.setState({
      alertPrimerInicio: false
    })
  }

  // Maneja la subida del archivo del estatuto
  handleChangeEstatuto(s, e) {
    console.log("Handle: " + s.id);
    let estatuto = 'archivo_estatuto' + s.id;
    if (e.target.files[0]) {
      this.setState({
        [estatuto]: e.target.files[0]
      })
    }
    else this.setState({
      [estatuto]: this.state[estatuto]
    })
  }

  actualizarEstatuto(sociedad) {
    let ruta = 'api/sociedadAnonima/' + sociedad.id + '/estatuto';
    let estatuto = 'archivo_estatuto' + sociedad.id;
    let cargandoSubidaEstatuto = 'cargandoSubidaEstatuto' + sociedad.id;

    this.setState({
      [cargandoSubidaEstatuto]: true
    }, () => {
      let formData = new FormData();
      formData.append('archivo_estatuto', this.state[estatuto]);

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
          this.setState({
            [estatuto]: null,
            mostrarAlertActualizacionEstatutoExitosa: true,
            [cargandoSubidaEstatuto]: false
          }, () => this.getTramitesEnCurso())
        })
        .catch(error => console.error(error));
    })
  }

  getTramitesEnCurso() {
    let ruta = 'api/sociedadesAnonimas';

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
          sociedades: data.data,
          sociedadesCargadas: true
        })
      })
      .catch(error => console.error(error));
  }

  redirectACorregirSolicitud(sociedad) {
    this.props.history.push({
      pathname: '/apoderado/corregir-sociedad-anonima',
      state: {
        data: this.props.location.state.data,
        sociedad: sociedad,
      }
    })
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

  mostrarSocios(sociedad) {
    return sociedad.socios.map((s) =>
      <Grid key={s.id} item xs={12}>
        <Typography
          variant="body1"
        >
          <b>{s.nombre} {s.apellido}</b>, con un {s.porcentaje}% {s.id == sociedad.apoderado_id ? <Chip label="Apoderado" color="primary" variant="outlined" /> : '.'}
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

  mostrarSociedades() {
    if (this.state.sociedadesCargadas) {
      return this.state.sociedades.map((s) => {
        let estatuto = 'archivo_estatuto' + s.id;
        let cargandoSubidaEstatuto = 'cargandoSubidaEstatuto' + s.id;
        return (
          <Box
            key={s.id}
            sx={{
              border: '0.1px solid #e8e8e8',
              px: 3,
              py: 2,
              mb: 2
            }}>
            <Grid container spacing={1}>
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
                    color: valorYColorLineaProgreso(s.estado_evaluacion).color.hexa,
                    fontWeight: 800,
                    fontSize: 14,
                    mt: -1,
                  }}
                >{textoEstadoDeEvaluacion(s, "apoderado")}
                </Typography>
              </Grid>
              {/* Si tiene que corregir la solicitud... */}
              <Grid item xs={12}>
                {s.estado_evaluacion.includes("Rechazado por empleado-mesa") &&
                  <Grid item xs={12}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      sx={{ my: 1 }}
                      onClick={this.redirectACorregirSolicitud.bind(this, s)}
                    >
                      Corregir solicitud
                    </Button>
                  </Grid>
                }
              </Grid>
              {/* Si tiene que actualizar el estatuto... */}
              <Grid item xs={12}>
                {s.estado_evaluacion.includes("Rechazado por escribano") &&
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <label htmlFor={"botonSubirEstatuto" + s.id}>
                        <TextField
                          id={'botonSubirEstatuto' + s.id}
                          type="file"
                          inputProps={{ accept: formatosValidosEstatuto }}
                          style={{ display: 'none' }}
                          onChange={this.handleChangeEstatuto.bind(this, s)}
                          required
                        />
                        <Button
                          variant="outlined"
                          component="span"
                          color="warning"
                          startIcon={<DescriptionIcon />}
                        >
                          Actualizar estatuto
                        </Button>
                      </label>
                    </Grid>
                    <Grid item xs={7}>
                      {this.state[estatuto] &&
                        <span>Nombre: {this.state[estatuto].name}</span>
                      }
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 2, fontSize: 15 }}>
                      <span>Recordá que los formatos válidos son: PDF, docx, ODT.</span>
                    </Grid>
                    {this.state[estatuto] &&
                      <Grid item xs={12} sx={{ mb: 2, fontSize: 15 }}>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={this.actualizarEstatuto.bind(this, s)}
                        >
                          Enviar estatuto actualizado
                        </Button>
                        {this.state[cargandoSubidaEstatuto] && <CircularProgress />}
                      </Grid>
                    }
                  </Grid>
                }
              </Grid>
              <Grid item xs={12} sm={7}>
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
              <Grid item xs={12} sm={5}>
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
                    Estados
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ mb: 1, width: '85%' }} />
                </Grid>
                {this.mostrarEstados(s)}
              </Grid>
            </Grid>
          </Box>
        )
      }
      )
    }
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
              <Paper className="dashboard-paper">
                {this.state.primerInicio ? (<div>
                  <Typography variant="h6">¡Bienvenido {user.name}!</Typography>
                  <Typography variant="body1">Con este sistema podrás registrar tu Sociedad Anónima y visualizar el estado del trámite.</Typography>
                </div>
                ) :
                  <Typography variant="h6">¡Hola de nuevo {user.name}!</Typography>
                }
              </Paper>
            </Grid>


            {/* Registro de S.A. - Paper */}
            <Grid item xs={4}>
              <Paper className="dashboard-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h1 className="dashboard-titulo" variant="h1">Registro de Sociedad Anónima</h1>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Para iniciar el trámite del registro de una S.A. hacé click en el botón:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/apoderado/registrar-sociedad-anonima',
                          state: { data: this.props.location.state.data }
                        })
                      }}
                    >
                      Registrar una S.A.
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Recordá que necesitás tener la siguiente información:</Typography>
                    <List dense={true}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: '15%' }}>
                          <ApartmentIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Nombre de la S.A."
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: '15%' }}>
                          <EventIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Fecha de creación"
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: '15%' }}>
                          <RoomIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Domicilio legal"
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: '15%' }}>
                          <RoomIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Domicilio real"
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: '15%' }}>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email del apoderado"
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: '15%' }}>
                          <GroupIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Información de los socios"
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: '15%' }}>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Estatuto en formato docx, PDF u ODT"
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Listado de trámites en curso - Paper */}
            <Grid item xs={8}>
              <Paper className="dashboard-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h1 className="dashboard-titulo" variant="h1">Trámites en curso</h1>
                  </Grid>
                  <Grid item xs={12}>
                    {this.state.sociedadesCargadas && (this.state.sociedades.length !== 0) ?
                      this.mostrarSociedades()
                      :
                      <span>Todavía no tenés ningún trámite en curso</span>
                    }
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Aviso de registro de solicitud de SA exitoso*/}
        <Snackbar
          open={this.state.mostrarAlertRegistroSAExitoso}
          onClose={this.noMostrarAlertRegistroSAExitoso}
          sx={{ width: '80%' }}
          spacing={2}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            variant="filled"
            onClose={this.noMostrarAlertRegistroSAExitoso}
            closeText={'Cerrar'}
          >
            <AlertTitle>¡La solicitud se ha registrado exitosamente!</AlertTitle>
            Ya podés visualizar tu trámite en la sección "Trámites en curso". La Mesa de Entradas evaluará la solicitud y
            te notificará cualquier novedad por correo electrónico, así que revisá tu bandeja de entrada regularmente.</Alert>
        </Snackbar>

        {/* Aviso de corrección de solicitud de SA exitosa*/}
        <Snackbar
          open={this.state.mostrarAlertCorreccionSAExitosa}
          onClose={this.noMostrarAlertCorreccionSAExitosa}
          sx={{ width: '80%' }}
          spacing={2}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            variant="filled"
            onClose={this.noMostrarAlertCorreccionSAExitosa}
            closeText={'Cerrar'}
          >
            <AlertTitle>¡La solicitud se ha corregido exitosamente!</AlertTitle>
            La mesa de entradas volverá a evaluar tu solicitud. Ante cualquier novedad te notificarán mediante correo electrónico.</Alert>
        </Snackbar>

        {/* Aviso de actualización de estatuto exitoso*/}
        <Snackbar
          open={this.state.mostrarAlertActualizacionEstatutoExitosa}
          onClose={this.noMostrarAlertActualizacionEstatutoExitosa}
          sx={{ width: '80%' }}
          spacing={2}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            variant="filled"
            onClose={this.noMostrarAlertActualizacionEstatutoExitosa}
            closeText={'Cerrar'}
          >
            <AlertTitle>¡El estatuto se actualizó exitosamente!</AlertTitle>
            Un escribano volverá a evaluar el estatuto. Ante cualquier novedad te notificará mediante correo electrónico.</Alert>
        </Snackbar>

        {/* Aviso de registro de usuario exitoso*/}
        <Snackbar
          open={this.state.alertPrimerInicio}
          onClose={this.noMostrarAlertPrimerInicio}
          sx={{ width: '80%' }}
          spacing={2}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            variant="filled"
            onClose={this.noMostrarAlertPrimerInicio}
            closeText={'Cerrar'}
          >
            <AlertTitle>¡Registro exitoso!</AlertTitle>
            Ya podés registrar tu Sociedad Anónima.</Alert>
        </Snackbar>


      </Container>
    )
  }
}
