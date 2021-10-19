import { React, Component } from "react";

import { Container, Grid, Paper, Chip, Divider, Typography, CircularProgress, Box, Button, Snackbar, Alert, AlertTitle, TextField, ListItemIcon, ListItemText, List, ListItem } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import DomainIcon from '@mui/icons-material/Domain';

import '../assets/css/dashboard.css'

import env from "@beam-australia/react-env";

import { getCookie } from '../helpers/helpers';

import { MostrarSociedad } from "components/MostrarSociedad";
import { MyAlert } from "components/MyAlert";


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

      sociedades: [],
      sociedadesCargadas: false,

      mostrarAlertCorreccionSAExitosa: false,

      mostrarAlertActualizacionEstatutoExitosa: false,
    }

    this.getTramitesEnCurso = this.getTramitesEnCurso.bind(this);
    this.noMostrarAlertRegistroSAExitoso = this.noMostrarAlertRegistroSAExitoso.bind(this);
    this.noMostrarAlertCorreccionSAExitosa = this.noMostrarAlertCorreccionSAExitosa.bind(this);
    this.noMostrarAlertActualizacionEstatutoExitosa = this.noMostrarAlertActualizacionEstatutoExitosa.bind(this);
    this.noMostrarAlertPrimerInicio = this.noMostrarAlertPrimerInicio.bind(this);
    this.agruparEstadosPorPais = this.agruparEstadosPorPais.bind(this);
    this.redirectACorregirSolicitud = this.redirectACorregirSolicitud.bind(this);
    this.renderizarCorregirSolicitud = this.renderizarCorregirSolicitud.bind(this);
    this.renderizarSubidaEstatuto = this.renderizarSubidaEstatuto.bind(this);

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

  // Renderiza todo el manejo del estatuto
  renderizarSubidaEstatuto(s) {
    let estatuto = 'archivo_estatuto' + s.id;
    let cargandoSubidaEstatuto = 'cargandoSubidaEstatuto' + s.id;
    return (
      <Grid item xs={12}>
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
      </Grid>
    )
  }

  renderizarCorregirSolicitud(s) {
    return (
      <Grid item xs={12}>
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
      </Grid>
    )
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
        console.log(data);
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

  agruparEstadosPorPais(estadosData) {
    let paisObj = {};
    let paises = [];
    let pais = '';
    let estados = [];
    for (let i = 0; i < estadosData.length; i++) {
      if (pais === '') {
        pais = estadosData[i].pais;
        paisObj = {
          nombre: pais,
          continente: estadosData[i].continente
        };
      }
      if (estadosData[i].pais !== pais) {
        paisObj.estados = estados; // le agrego los estados al obj del pais
        paises.push(paisObj); // Pusheo el pais al array

        pais = estadosData[i].pais; // Seteo el nuevo país
        estados = []; // Reseteo el array de estados por país
        // Reseteo el object del país
        paisObj = {
          nombre: pais,
          continente: estadosData[i].continente
        };
      }
      estados.push(estadosData[i].name); // Le agrego el primer estado
      if (i === estadosData.length - 1) { // si es el último...
        paisObj.estados = estados; // le agrego los estados al obj del pais
        paises.push(paisObj); // Pusheo el pais al array
      }
    }
    return paises
  }

  mostrarEstados(sociedad) {
    let paises = this.agruparEstadosPorPais(sociedad.estados);
    return paises.map((p) =>
      <Grid key={p.nombre} container>
        <Grid item xs={12}>
          <Typography variant="body1"><strong>{p.nombre}</strong> <i>({p.continente})</i>:{' '}
            {p.estados.map((e) => {
              return e === p.estados[p.estados.length - 1] ? e : e + ', '
            })}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  mostrarSociedades() {
    if (this.state.sociedadesCargadas) {
      return this.state.sociedades.map((s) =>
        <MostrarSociedad
          sociedad={s}
          renderizarSubidaEstatuto={this.renderizarSubidaEstatuto}
          renderizarCorregirSolicitud={this.renderizarCorregirSolicitud}
        />
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
                          <PublicIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Países y estados a los que exporta"
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
                    {this.state.sociedadesCargadas ? (
                      this.state.sociedades && this.state.sociedades.length !== 0 ?
                        this.mostrarSociedades()
                        :
                        <span>Todavía no tenés ningún trámite en curso</span>
                    ) : (
                      <Grid container spacing={2} alignItems='center'>
                        <Grid item>
                          <CircularProgress />
                        </Grid>
                        <Grid item>
                          <span>Cargando trámites...</span>
                        </Grid>
                      </Grid>
                    )
                    }
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Alert de registro de solicitud de SA exitoso */}
        <MyAlert
          open={this.state.mostrarAlertRegistroSAExitoso}
          onClose={this.noMostrarAlertRegistroSAExitoso}
          title="¡La solicitud se ha registrado exitosamente!"
          text='Ya podés visualizar tu trámite en la sección "Trámites en curso". La Mesa de Entradas evaluará la solicitud y
                te notificará cualquier novedad por correo electrónico, así que revisá tu bandeja de entrada regularmente.'
          severity="success"
          variant="filled"
        />

        {/* Alert de corrección de solicitud de SA exitoso */}
        <MyAlert
          open={this.state.mostrarAlertCorreccionSAExitosa}
          onClose={this.noMostrarAlertCorreccionSAExitosa}
          title="¡La solicitud se ha corregido exitosamente!"
          text='La mesa de entradas volverá a evaluar tu solicitud. Ante cualquier novedad te notificarán mediante correo electrónico.'
          severity="success"
          variant="filled"
        />

        {/* Aviso de actualización de estatuto exitoso */}
        <MyAlert
          open={this.state.mostrarAlertActualizacionEstatutoExitosa}
          onClose={this.noMostrarAlertActualizacionEstatutoExitosa}
          title="¡El estatuto se actualizó exitosamente!"
          text='Un escribano volverá a evaluar el estatuto. Ante cualquier novedad te notificará mediante correo electrónico.'
          severity="success"
          variant="filled"
        />

        {/* Aviso de registro de usuario exitoso */}
        <MyAlert
          open={this.state.alertPrimerInicio}
          onClose={this.noMostrarAlertPrimerInicio}
          title="¡Registro exitoso!"
          text='Ya podés registrar tu Sociedad Anónima.'
          severity="success"
          variant="filled"
        />

      </Container>
    )
  }
}
