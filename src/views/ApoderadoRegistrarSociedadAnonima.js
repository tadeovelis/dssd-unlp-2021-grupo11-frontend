import { React, Component } from "react";

import { Container, Grid, Paper, FormControl, TextField, InputAdornment, Divider, FormControlLabel } from '@mui/material';
import { Box, Button, Checkbox, CircularProgress } from "@mui/material";

import DescriptionIcon from '@mui/icons-material/Description';

import { es } from "date-fns/locale";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import 'assets/css/apoderado-registro-sa.css';
import 'assets/css/dashboard.css';

import env from "@beam-australia/react-env";


const formatosValidosEstatuto = 'application/pdf,' +
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
    'application/vnd.oasis.opendocument.text';

export default class ApoderadoDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {

            // Generales
            nombre: '',
            fecha_creacion: null,
            domicilio_legal: '',
            domicilio_real: '',
            email_apoderado: '',

            // Socios
            cantSocios: 1,
            socio1: { apellido: '', nombre: '', porcentaje: 0, apoderado: 'false' },

            // Estatuto
            archivo_estatuto: null,

            todosLosDatosCompletados: false,
            sociosCompletados: false,

            activarCircularProgress: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.seCompletaronLosSocios = this.seCompletaronLosSocios.bind(this);
        this.handleChangeSocio = this.handleChangeSocio.bind(this);
        this.habilitarFormSocio = this.habilitarFormSocio.bind(this);
        this.removerSocio = this.removerSocio.bind(this);
        this.handleChangeEsApoderado = this.handleChangeEsApoderado.bind(this);
        this.generarFormsSocios = this.generarFormsSocios.bind(this);
        this.armarJSONSocios = this.armarJSONSocios.bind(this);
        this.handleChangeEstatuto = this.handleChangeEstatuto.bind(this);
    }

    // Maneja los cambios de los datos generales
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }

    // Actualiza el estado de la fecha de creacion
    cambiarFecha = (date) => {
        this.setState({
            fecha_creacion: date,
        }, () => this.validarSiEstanTodosLosDatosCompletados());
    };

    // Maneja los cambios del checkbox de Es Apoderado
    handleChangeEsApoderado(e) {
        let valor = e.target.checked ? "true" : "false";
        let socio = 'socio' + e.currentTarget.getAttribute('data-numdesocio');
        this.setState({
            [socio]: { ...this.state[socio], [e.target.name]: valor }
        }, () => {
            this.validarSiEstanTodosLosDatosCompletados()
        })
    }

    // Maneja los cambios de los forms de los socios
    handleChangeSocio(e) {
        let socio = 'socio' + e.currentTarget.getAttribute('data-numdesocio');
        this.setState({
            [socio]: { ...this.state[socio], [e.target.name]: e.target.value }
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }

    // Maneja la subida del archivo del estatuto
    handleChangeEstatuto(e) {
        if (e.target.files[0]) {
            this.setState({
                archivo_estatuto: e.target.files[0]
            }, () => this.validarSiEstanTodosLosDatosCompletados())
        }
        else this.setState({
            archivo_estatuto: this.state.archivo_estatuto
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }


    // Prepara un nuevo socio vacío para que la función que arma los forms prepare otro
    habilitarFormSocio() {
        let socio = 'socio' + (this.state.cantSocios + 1);
        this.setState({
            [socio]: { apellido: '', nombre: '', porcentaje: 0, apoderado: 'false' }
        }, () => {
            this.setState({ cantSocios: this.state.cantSocios + 1 })
        });
    }

    removerSocio(e) {
        if (this.state.cantSocios > 1) {
            let num = e.currentTarget.getAttribute('data-numdesocio');
            let soc = '';
            let nextSoc = '';
            for (let i = num; i < this.state.cantSocios; i++) {
                soc = 'socio' + num;
                nextSoc = 'socio' + (+num + 1);
                let nextSocObj = this.state[nextSoc]
                this.setState({
                    ...this.state,
                    [soc]: nextSocObj
                })
            };
            this.setState({
                cantSocios: this.state.cantSocios - 1
            })
        }
        else {
            alert('La sociedad tiene que tener un socio como mínimo')
        }
    }

    // Generar forms de los socios
    generarFormsSocios() {
        let forms = [];
        let soc = '';
        for (let i = 0; i < this.state.cantSocios; i++) {
            soc = 'socio' + (i + 1)
            forms.push(
                <Grid key={this.state[soc].id} container spacing={3} justifyContent="flex-start" alignItems="center">
                    <Grid item>
                        <Button
                            data-numdesocio={i + 1}
                            variant="contained"
                            style={{ backgroundColor: '#fa0000', 'color': 'white' }}
                            onClick={this.removerSocio}
                        >Remover
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth={true}>
                            <TextField
                                name="apellido"
                                id={"apellido" + (i + 1)}
                                placeholder="Ej: Gómez"
                                label="Apellido"
                                required={true}
                                value={this.state[soc].apellido}
                                onChange={this.handleChangeSocio}
                                helperText="[Texto de ayuda]"
                                inputProps={{
                                    'data-numdesocio': (i + 1)
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth={true}>
                            <TextField
                                name="nombre"
                                id={"nombre" + (i + 1)}
                                placeholder="Ej: Roberto"
                                label="Nombre"
                                required={true}
                                value={this.state[soc].nombre}
                                onChange={this.handleChangeSocio}
                                helperText="[Texto de ayuda]"
                                inputProps={{
                                    'data-numdesocio': (i + 1)
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl fullWidth={true}>
                            <TextField
                                type="number"
                                name="porcentaje"
                                id={"porcentaje" + (i + 1)}
                                placeholder="Entre 0 y 100"
                                label="Porcentaje"
                                required={true}
                                value={this.state[soc].porcentaje}
                                onChange={this.handleChangeSocio}
                                helperText="[Texto de ayuda]"
                                inputProps={{
                                    'data-numdesocio': (i + 1)
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl fullWidth={true}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={this.handleChangeEsApoderado}
                                        inputProps={{
                                            'data-numdesocio': (i + 1)
                                        }} />
                                }
                                name="apoderado"
                                id={"apoderado" + (i + 1)}
                                label="¿Es apoderado?" />
                        </FormControl>
                    </Grid>
                </Grid>
            )
        }
        return forms;
    }

    // Arma un JSON con los socios
    armarJSONSocios() {
        if (this.seCompletaronLosSocios()) {
            let socios = [];
            for (let i = 0; i < this.state.cantSocios; i++) {
                let soc = 'socio' + (i + 1);
                socios.push(
                    {
                        'apellido': this.state[soc].apellido, 'nombre': this.state[soc].nombre,
                        'porcentaje': this.state[soc].porcentaje, 'apoderado': this.state[soc].apoderado
                    }
                )
            }
            let jsonSocios = JSON.stringify(socios);
            console.log(jsonSocios);
            return jsonSocios
        }
    }

    // Devuelve bool si están o no completos los datos de los socios
    seCompletaronLosSocios() {
        for (let i = 0; i < this.state.cantSocios; i++) {
            let soc = 'socio' + (i + 1);
            if (this.state[soc].apellido === '' || this.state[soc].nombre === '') {
                return false
            }
        }
        return true
    }
    seSubioElEstatuto() {
        return this.state.archivo_estatuto !== null;
    }
    seCompletaronLosDatosGenerales() {
        if (this.state.nombre === '' || this.state.fecha_creacion === null ||
            this.state.domicilio_legal === '' || this.state.domicilio_real === '' ||
            this.state.email_apoderado === '') {
            return false
        }
        else return true
    }
    validarSiEstanTodosLosDatosCompletados() {
        if (this.seCompletaronLosDatosGenerales() &&
            this.seCompletaronLosSocios() &&
            this.seSubioElEstatuto()) {
            this.setState({
                todosLosDatosCompletados: true
            })
        }
        else {
            this.setState({
                todosLosDatosCompletados: false
            })
        }
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

    // El submit
    handleSubmit(e) {
        this.setState({
            activarCircularProgress: true
        })
        let ruta = 'api/sociedadAnonima';
        let socios = this.armarJSONSocios();
        let formData = new FormData();
        formData.append('nombre', this.state.nombre);
        formData.append('fecha_creacion', this.formatDate(this.state.fecha_creacion.toDateString()));
        formData.append('domicilio_legal', this.state.domicilio_legal);
        formData.append('domicilio_real', this.state.domicilio_real);
        formData.append('email_apoderado', this.state.email_apoderado);
        formData.append('socios', socios);
        formData.append('archivo_estatuto', this.state.archivo_estatuto);

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + this.props.location.state.data.auth.access_token
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) alert("Datos incorrectos")
                else {
                    this.setState({
                        activarCircularProgress: false
                    })

                    // Redireccionar al dashboard
                    this.props.history.push({
                        pathname: '/apoderado/inicio',
                        state: {
                            registroDeSAExitoso: true,
                            refreshTramites: true,
                            data: this.props.location.state.data
                        }
                    })
                }
            })
            .catch(error => console.error(error));
        e.preventDefault();
    }

    render() {
        return (
            <Container>
                <Box p={2}>
                    <Paper className="dashboard-paper">
                        <span className="apoderado-registrar-sa-titulo">
                            Registro de Sociedad Anónima
                        </span>
                        <p>Ingresá los siguientes datos. Todos los campos son obligatorios.</p>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <FormControl fullWidth={true}>
                                    <TextField
                                        name="nombre"
                                        id="nombre"
                                        placeholder="Sancor S.A."
                                        label="Nombre"
                                        required={true}
                                        value={this.state.nombre}
                                        onChange={this.handleChange}
                                        helperText="Debe tener como máximo 50 caracteres"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth={true}>
                                    <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                                        <DesktopDatePicker
                                            id="fecha_creacion"
                                            name="fecha_creacion"
                                            required
                                            label="Fecha de creación"
                                            inputFormat="dd/MM/yyyy"
                                            value={this.state.fecha_creacion}
                                            onChange={this.cambiarFecha}
                                            renderInput={params =>
                                                <TextField {...params} helperText="Ej: 24/09/2015" />
                                            }
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth={true}>
                                    <TextField
                                        name="domicilio_legal"
                                        id="domicilio_legal"
                                        placeholder="Calle 30 Nro 182"
                                        label="Domicilio legal"
                                        required={true}
                                        value={this.state.domicilio_legal}
                                        onChange={this.handleChange}
                                        helperText="[Texto de ayuda]"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth={true}>
                                    <TextField
                                        name="domicilio_real"
                                        id="domicilio_real"
                                        placeholder="Calle 30 Nro 182"
                                        label="Domicilio real"
                                        required={true}
                                        value={this.state.domicilio_real}
                                        onChange={this.handleChange}
                                        helperText="[Texto de ayuda]"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth={true}>
                                    <TextField
                                        name="email_apoderado"
                                        id="email_apoderado"
                                        placeholder="jorge@gmail.com"
                                        label="Email del apoderado"
                                        required={true}
                                        value={this.state.email_apoderado}
                                        onChange={this.handleChange}
                                        helperText="[Texto de ayuda]"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider
                            style={{
                                margin: '30px 0px 10px 0px'
                            }}
                        />

                        {/* SOCIOS */}
                        <div>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <p>Agregá los socios. Si querés eliminar alguno hacé click en 'Remover'.</p>
                                </Grid>

                                {/* Forms de los socios */}
                                <Grid item xs={12}>
                                    <Box>
                                        {this.generarFormsSocios()}
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                {/* Botón para agregar otro socio */}
                                <Grid item xs={3}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={this.habilitarFormSocio}
                                    >Agregar otro socio
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>

                        <Divider
                            style={{
                                margin: '30px 0px 10px 0px'
                            }}
                        />

                        {/* Componente para el archivo del estatuto */}
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item xs={12}>
                                <p>Hacé click en el botón para subir el Estatuto. Los formatos válidos son: PDF, docx, ODT.</p>
                            </Grid>
                            <Grid item xs={2}>
                                <label htmlFor="botonSubirEstatuto">
                                    <TextField
                                        id='botonSubirEstatuto'
                                        type="file"
                                        inputProps={{ accept: formatosValidosEstatuto }}
                                        style={{ display: 'none' }}
                                        onChange={this.handleChangeEstatuto}
                                        required
                                    />
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        color="primary"
                                        startIcon={<DescriptionIcon />}
                                    >
                                        Subir archivo
                                    </Button>
                                </label>
                            </Grid>
                            <Grid item xs={10}>
                                {this.state.archivo_estatuto !== null &&
                                    <span>Nombre: {this.state.archivo_estatuto.name}</span>
                                }
                            </Grid>
                        </Grid>

                        <Divider
                            style={{
                                margin: '30px 0px 10px 0px'
                            }}
                        />

                        {/* Sección final */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {this.state.todosLosDatosCompletados ?
                                    <p>Revisá bien todos los datos, y cuando estés listo hacé click en el botón.</p>
                                    :
                                    <p>Para registrar la sociedad primero completá todos los datos necesarios.</p>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!this.state.todosLosDatosCompletados}
                                    onClick={this.handleSubmit}
                                >
                                    Registrar mi sociedad anónima
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                {this.state.activarCircularProgress && <CircularProgress />}
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        )
    }
}