import { React, Component } from "react";

import { Container, Grid, Paper, Typography, CircularProgress, Box, Button } from '@mui/material';

import '../assets/css/dashboard.css'

import env from "@beam-australia/react-env";

import { MostrarSociedad } from "components/MostrarSociedad";
import { MyAlert } from "components/MyAlert";
import ActualizacionEstatuto from "components/ActualizacionEstatuto";
import RequisitosRegistrarSociedadAnonima from "components/RequisitosRegistrarSociedadAnonima";
import { withCookies } from "react-cookie";


class ApoderadoDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // access_token desde las cookies|
      access_token: this.props.cookies.get('access_token'),

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
    this.redirectACorregirSolicitud = this.redirectACorregirSolicitud.bind(this);
    this.renderizarCorregirSolicitud = this.renderizarCorregirSolicitud.bind(this);
    this.renderizarSubidaEstatuto = this.renderizarSubidaEstatuto.bind(this);
    this.handleChangeEstatuto = this.handleChangeEstatuto.bind(this);
    this.actualizarEstatuto = this.actualizarEstatuto.bind(this);

  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.registroDeSAExitoso) {
      this.setState({
        mostrarAlertRegistroSAExitoso: true
      })
    }

    if (this.props.location.state && this.props.location.state.primerInicio) {
      this.setState({
        primerInicio: true,
        alertPrimerInicio: true
      })
    }

    if (this.props.location.state && this.props.location.state.correccionDeSAExitosa) {
      this.setState({
        mostrarAlertCorreccionSAExitosa: true
      })
    }

    this.getTramitesEnCurso();
  }

  componentDidUpdate(prevProps) {
    // Uso tipico (no olvides de comparar las props):
    if (this.props.location.state && this.props.location.state.refreshTramites !== prevProps.location.state.refreshTramites) {
      this.getTramitesEnCurso();
    }
  }

  noMostrarAlertRegistroSAExitoso() {
    this.setState({
      mostrarAlertRegistroSAExitoso: false
    }, () => {
      this.props.location.state.primerInicio
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
  handleChangeEstatuto(e, s) {
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

  actualizarEstatuto(e, sociedad) {
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
          'Authorization': 'Bearer ' + this.state.access_token
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

  // Renderiza todo el manejo del estatuto
  renderizarSubidaEstatuto(s) {
    let estatuto = 'archivo_estatuto' + s.id;
    let cargandoSubidaEstatuto = 'cargandoSubidaEstatuto' + s.id;
    return (
      <ActualizacionEstatuto
        s={s}
        handleChangeEstatuto={this.handleChangeEstatuto}
        actualizarEstatuto={this.actualizarEstatuto}
        estatuto={this.state[estatuto]}
        cargandoSubidaEstatuto={this.state[cargandoSubidaEstatuto]}
      />
    )
  }

  // Redirect a corregir solicitud por rechazo de mesa de entradas
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

  redirectACorregirSolicitud(sociedad) {
    this.props.history.push({
      pathname: '/apoderado/corregir-sociedad-anonima',
      state: {
        data: this.props.location.state.data,
        sociedad: sociedad,
      }
    })
  }


  // Obtiene los tr??mites en curso
  getTramitesEnCurso() {

    let ruta = 'api/sociedadesAnonimas';

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
        this.setState({
          sociedades: data.data,
          sociedadesCargadas: true
        })
      })
      .catch(error => console.error(error));
  }


  // Muestra las sociedades con el componente MostrarSociedad
  mostrarSociedades() {
    if (this.state.sociedadesCargadas) {
      return this.state.sociedades.map((s) =>
        <MostrarSociedad
          sociedad={s}
          renderizarSubidaEstatuto={this.renderizarSubidaEstatuto}
          renderizarCorregirSolicitud={this.renderizarCorregirSolicitud}
          rol={env("ROL_APODERADO")}
        />
      )
    }
  }


  // RENDER
  render() {

    // Nombre del usuario
    const user_name = this.props.cookies.get("name");

    return (
      <Container>
        <Box p={2}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Paper className="dashboard-paper">
                {this.state.primerInicio ? (<div>
                  <Typography variant="h6">??Bienvenido {user_name}!</Typography>
                  <Typography variant="body1">Con este sistema podr??s registrar tu Sociedad An??nima y visualizar el estado del tr??mite.</Typography>
                </div>
                ) :
                  <Typography variant="h6">??Hola de nuevo {user_name}!</Typography>
                }
              </Paper>
            </Grid>

            {/* Registro de S.A. - Paper */}
            <Grid item xs={4}>
              <Paper className="dashboard-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h1 className="dashboard-titulo" variant="h1">Registro de Sociedad An??nima</h1>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Para iniciar el tr??mite del registro de una S.A. hac?? click en el bot??n:</Typography>
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
                    <RequisitosRegistrarSociedadAnonima />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Listado de tr??mites en curso - Paper */}
            <Grid item xs={8}>
              <Paper className="dashboard-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h1 className="dashboard-titulo" variant="h1">Tr??mites en curso</h1>
                  </Grid>
                  <Grid item xs={12}>
                    {this.state.sociedadesCargadas ? (
                      this.state.sociedades && this.state.sociedades.length !== 0 ?
                        this.mostrarSociedades()
                        :
                        <span>Todav??a no ten??s ning??n tr??mite en curso</span>
                    ) : (
                      <Grid container spacing={2} alignItems='center'>
                        <Grid item>
                          <CircularProgress />
                        </Grid>
                        <Grid item>
                          <span>Cargando tr??mites...</span>
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
          title="??La solicitud se ha registrado exitosamente!"
          text='Ya pod??s visualizar tu tr??mite en la secci??n "Tr??mites en curso". La Mesa de Entradas evaluar?? la solicitud y
                te notificar?? cualquier novedad por correo electr??nico, as?? que revis?? tu bandeja de entrada regularmente.'
          severity="success"
          variant="filled"
        />

        {/* Alert de correcci??n de solicitud de SA exitoso */}
        <MyAlert
          open={this.state.mostrarAlertCorreccionSAExitosa}
          onClose={this.noMostrarAlertCorreccionSAExitosa}
          title="??La solicitud se ha corregido exitosamente!"
          text='La mesa de entradas volver?? a evaluar tu solicitud. Ante cualquier novedad te notificar??n mediante correo electr??nico.'
          severity="success"
          variant="filled"
        />

        {/* Aviso de actualizaci??n de estatuto exitoso */}
        <MyAlert
          open={this.state.mostrarAlertActualizacionEstatutoExitosa}
          onClose={this.noMostrarAlertActualizacionEstatutoExitosa}
          title="??El estatuto se actualiz?? exitosamente!"
          text='Un escribano volver?? a evaluar el estatuto. Ante cualquier novedad te notificar?? mediante correo electr??nico.'
          severity="success"
          variant="filled"
        />

        {/* Aviso de registro de usuario exitoso */}
        <MyAlert
          open={this.state.alertPrimerInicio}
          onClose={this.noMostrarAlertPrimerInicio}
          title="??Registro exitoso!"
          text='Ya pod??s registrar tu Sociedad An??nima.'
          severity="success"
          variant="filled"
        />

      </Container>
    )
  }
}

export default withCookies(ApoderadoDashboard)
