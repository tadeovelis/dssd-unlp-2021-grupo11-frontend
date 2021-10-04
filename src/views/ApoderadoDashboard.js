import { React, Component } from "react";

import { Container, Grid, Paper, Divider, Typography, Box, Button, Snackbar, Alert, AlertTitle } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import '../assets/css/apoderado.css'


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

export default class ApoderadoDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mostrarAlertRegistroSAExitoso: false,
      primerInicio: false,
      alertPrimerInicio: false,

      sociedades: null,
      sociedadesCargadas: false,
      textoEstadoEvaluacion: []
    }

    this.getTramitesEnCurso = this.getTramitesEnCurso.bind(this);
    this.noMostrarAlertRegistroSAExitoso = this.noMostrarAlertRegistroSAExitoso.bind(this);
    this.noMostrarAlertPrimerInicio = this.noMostrarAlertPrimerInicio.bind(this);
  }

  columns = [
    { field: 'nombre', headerName: 'Nombre', width: 90 },
    { field: 'email_apoderado', headerName: 'Email del apoderado', width: 90 },
    { field: 'domicilio_legal', headerName: 'Domicilio legal', width: 90 },
    { field: 'domicilio_real', headerName: 'Domicilio real', width: 90 },
    { field: 'fecha_creacion', headerName: 'Fecha de creación', width: 90 },
    { field: 'socios', headerName: 'Socios', width: 90 }
  ];

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
  noMostrarAlertPrimerInicio() {
    this.setState({
      alertPrimerInicio: false
    })
  }

  getTramitesEnCurso() {
    let ruta = 'api/sociedadesAnonimas';

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
          sociedades: data,
          sociedadesCargadas: true
        })
      })
      .catch(error => console.error(error));
  }

  textoEstadoEvaluacion(sociedad) {
    if (sociedad.estado_evaluacion.includes("endiente mesa de entradas")) {
      return 'El trámite está siendo evaluado por la mesa de entradas'
    }
    else return sociedad.estado_evaluacion
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
          <b>{s.nombre} {s.apellido}</b>, con un {s.porcentaje}%.
        </Typography>
      </Grid>
    )
  }

  mostrarSociedades() {
    if (this.state.sociedadesCargadas) {
      return this.state.sociedades.map((s) =>
        <Box
          sx={{
            border: '0.1px solid #e8e8e8',
            px: 3,
            py: 2,
            mb: 2
          }}>
          <Grid key={s.id} container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">{s.nombre}</Typography>
            </Grid>
            <Box sx={{ width: '100%', my: 1 }}>
              <BorderLinearProgress
                variant="buffer" value={33} valueBuffer={0} />
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
              >{this.textoEstadoEvaluacion(s)}
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
          </Grid>
        </Box>
      )
    }
  }


  render() {

    // Acá me traigo el response del login
    const user = this.props.location.state.data.user;
    const auth = this.props.location.state.data.auth;

    let mostrarAlertRegistroSAExitoso = this.props.location.state.registroDeSAExitoso;


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
              <Paper className="apoderado-paper">
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
              <Paper className="apoderado-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h1 className="apoderado-titulo" variant="h1">Registro de Sociedad Anónima</h1>
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
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Listado de trámites en curso - Paper */}
            <Grid item xs={8}>
              <Paper className="apoderado-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h1 className="apoderado-titulo" variant="h1">Trámites en curso</h1>
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

        {/* Aviso de solicitud de SA exitoso*/}
        <Snackbar
          open={this.state.mostrarAlertRegistroSAExitoso}
          onCLose={this.noMostrarAlertRegistroSAExitoso}
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

        {/* Aviso de registro de usuario exitoso*/}
        <Snackbar
          open={this.state.alertPrimerInicio}
          onCLose={this.noMostrarAlertPrimerInicio}
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
