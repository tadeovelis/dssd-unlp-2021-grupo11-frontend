import { React, Component } from "react";

import { Container, Box, Grid, Paper, Typography, Button } from '@material-ui/core';
import { DataGrid } from '@mui/x-data-grid';

import '../assets/css/apoderado.css'

export default class ApoderadoDashboard extends Component {
  constructor(props) {
    super(props);

    this.getTramitesEnCurso = this.getTramitesEnCurso.bind(this);
  }

  columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''
        }`,
    },
  ];

  rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  componentDidMount() {
    //this.getTramitesEnCurso();
  }

  getTramitesEnCurso() {
    let ruta = 'api/sociedadesAnonimas';

    fetch('http://localhost/' + ruta, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer '+this.props.location.state.data.auth.access_token
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error(error));
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
                    {/*
                    <div style={{ height: '300px', width: '100%' }}>
                      <DataGrid
                        rows={this.rows}
                        columns={this.columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                      />
                    </div>
                    */}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Aviso de solicitud de SA exitoso
        {this.state.registroDeSAExitoso &&

        */}
      </Container>
    )
  }
}
