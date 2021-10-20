import { React, Component, useEffect } from "react";

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


// Apollo client - GraphQL
import {
    useQuery,
    gql
} from "@apollo/client";
import { FormsPaises } from "../components/FormsPaises.js";
import Logout from "../components/Logout.js";
import { getCookie } from "helpers/helpers.js";
import { formatDate } from "helpers/helpers.js";


const formatosValidosEstatuto = 'application/pdf,' +
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
    'application/vnd.oasis.opendocument.text';


function ApoderadoRegistrarSociedadAnonima(props) {

    // Datos generales
    const [nombre, setNombre] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState(null);
    const [domicilioLegal, setDomicilioLegal] = useState('');
    const [domicilioReal, setDomicilioReal] = useState('');
    const [emailApoderado, setEmailApoderado] = useState('');

    // Estado para los socios
    const [cantSocios, setCantSocios] = useState(1);
    const [socio1, setSocio1] = useState({
        apellido: '', nombre: '', porcentaje: 0, apoderado: 'false'
    });

    // Estatuto
    const [archivoEstatuto, setArchivoEstatuto] = useState(null);

    // Países y estados
    const [pais1, setPais1] = useState('');
    const [inputPais1, setInputPais1] = useState('');
    const [estados1, estados1] = useState([]);
    const [inputEstados1, inputEstados1] = useState('');
    const [cantPaises, setCantPaises] = useState(1);

    // Validaciones
    const [todosLosDatosCompletados, setTodosLosDatosCompletados] = useState(false);
    const [sociosCompletados, setSociosCompletados] = useState(false);

    // Iconito de carga
    const [activarCircularProgress, setActivarCircularProgress] = useState(false);


    // Maneja los cambios de los datos generales
    const handleChange = (e) => {
        setState(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    // Actualiza el estado de la fecha de creacion
    const cambiarFecha = (date) => {
        setFechaCreacion(date)
    };

    // Maneja los cambios del checkbox de Es Apoderado
    const handleChangeEsApoderado = (e) => {
        let valor = e.target.checked ? "true" : "false";
        let socio = 'socio' + e.currentTarget.getAttribute('data-numdesocio');
        setState(prev => ({
            ...prev,
            [socio]: { ...state[socio], [e.target.name]: valor }
        }))
    }
    // Maneja los cambios de los forms de los socios
    const handleChangeSocio = (e) => {
        let socio = 'socio' + e.currentTarget.getAttribute('data-numdesocio');
        setState(prev => ({
            [socio]: { ...state[socio], [e.target.name]: e.target.value }
        }))
    }

    // Maneja la subida del archivo del estatuto
    const handleChangeEstatuto = (e) => {
        if (e.target.files[0]) {
            setArchivoEstatuto(e.target.files[0])
        }
        else setArchivoEstatuto(archivoEstatuto)
    }


    // Prepara un nuevo socio vacío para que la función que arma los forms prepare otro
    const habilitarFormSocio = () => {
        let socio = 'socio' + (cantSocios + 1);
        setState(prev => ({
            ...prev,
            [socio]: { apellido: '', nombre: '', porcentaje: 0, apoderado: 'false' }
        }))
        this.setState({
            [socio]: { apellido: '', nombre: '', porcentaje: 0, apoderado: 'false' }
        }, () => {
            this.setState({ cantSocios: this.state.cantSocios + 1 })
        });
    }

    // Métodos que le paso como props a FormsPaises
    const handleChangePais = (e, pais, numPais) => {
        let p = 'pais' + numPais;
        this.setState({
            [p]: pais
        });
    }
    const handleChangeInputPais = (e, inputPais, numPais) => {
        let iP = 'inputPais' + numPais;
        this.setState({
            [iP]: inputPais
        })
    }

    const handleChangeEstados = (e, estados, numPais) => {
        let es = 'estados' + numPais;
        this.setState({
            [es]: estados
        })
    }
    const handleChangeInputEstados = (e, inputEstados, numPais) => {
        let iEs = 'inputEstados' + numPais;
        this.setState({
            [iEs]: inputEstados
        })
    }

    const removerPais = (e, numPais) => {
        let pais = '';
        let inputPais = '';
        let nextPais = '';
        let nextInputPais = '';
        let estados = '';
        let inputEstados = '';
        let nextEstados = '';
        let nextInputEstados = '';
        for (let i = numPais; i < this.state.cantPaises; i++) {
            pais = 'pais' + i;
            inputPais = 'inputPais' + i;
            nextPais = 'pais' + (i + 1);
            nextInputPais = 'inputPais' + (i + 1);
            estados = 'estados' + i;
            inputEstados = 'inputEstados' + i;
            nextEstados = 'estados' + (i + 1);
            nextInputEstados = 'inputEstados' + (i + 1);
            let nextPaisState = this.state[nextPais];
            let nextInputPaisState = this.state[nextInputPais];
            let nextEstadosState = this.state[nextEstados];
            let nextInputEstadosState = this.state[nextInputEstados];
            this.setState({
                [pais]: nextPaisState,
                [inputPais]: nextInputPaisState,
                [estados]: nextEstadosState,
                [inputEstados]: nextInputEstadosState,
            });
        };
        this.setState({
            cantPaises: this.state.cantPaises - 1
        })
    }
    // Prepara un nuevo país vacío para que la función que arma los forms prepare otro
    const habilitarFormPais = () => {
        let pais = 'pais' + (this.state.cantPaises + 1);
        let inputPais = 'inputPais' + (this.state.cantPaises + 1);
        let estados = 'estados' + (this.state.cantPaises + 1);
        let inputEstados = 'inputEstados' + (this.state.cantPaises + 1);
        this.setState({
            [pais]: '',
            [inputPais]: '',
            [estados]: [],
            [inputEstados]: '',
        }, () => {
            this.setState({ cantPaises: this.state.cantPaises + 1 })
        });
    }

    const armarJSONPaisesYEstados = () => {
        let paises = [];
        if (this.state.cantPaises > 0) {
            for (let i = 0; i < this.state.cantPaises; i++) {
                let pais = 'pais' + (i + 1);
                let estados = 'estados' + (i + 1);
                console.log(this.state[estados]);
                paises.push(
                    {
                        'code': this.state[pais].code,
                        'name': this.state[pais].name,
                        'continent': this.state[pais].continent.name,
                        'estados': this.state[estados]
                    }
                )
            }
        }
        else {

        }
        let jsonPaises = JSON.stringify(paises);
        console.log(jsonPaises);
        return jsonPaises;
    }


    const removerSocio = (e) => {
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
    const generarFormsSocios = () => {
        let forms = [];
        let soc = '';
        for (let i = 0; i < this.state.cantSocios; i++) {
            soc = 'socio' + (i + 1);
            forms.push(
                <Grid key={i} container spacing={3} justifyContent="flex-start" alignItems="center">
                    <Grid item>
                        <Button
                            data-numdesocio={i + 1}
                            variant="contained"
                            style={{ backgroundColor: '#fa0000', 'color': 'white' }}
                            onClick={removerSocio}
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
                                onChange={handleChangeSocio}
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
                                onChange={handleChangeSocio}
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
                                onChange={handleChangeSocio}
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
                                        onChange={handleChangeEsApoderado}
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
    const armarJSONSocios = () => {
        if (seCompletaronLosSocios()) {
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
    const seCompletaronLosSocios = () => {
        for (let i = 0; i < this.state.cantSocios; i++) {
            let soc = 'socio' + (i + 1);
            if (this.state[soc].apellido === '' || this.state[soc].nombre === '') {
                return false
            }
        }
        return true
    }
    const seSubioElEstatuto = () => {
        return this.state.archivo_estatuto !== null;
    }
    const seCompletaronLosDatosGenerales = () => {
        if (this.state.nombre === '' || this.state.fecha_creacion === null ||
            this.state.domicilio_legal === '' || this.state.domicilio_real === '' ||
            this.state.email_apoderado === '') {
            return false
        }
        else return true
    }
    const validarSiEstanTodosLosDatosCompletados = () => {
        if (seCompletaronLosDatosGenerales() &&
            seCompletaronLosSocios() &&
            seSubioElEstatuto()) {
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

    // El submit
    const handleSubmit = (e) => {
        this.setState({
            activarCircularProgress: true
        })
        let ruta = 'api/sociedadAnonima';
        let socios = armarJSONSocios();
        //let paises_estados = this.armarJSONPaisesYEstados();
        let formData = new FormData();
        formData.append('nombre', this.state.nombre);
        formData.append('fecha_creacion', formatDate(this.state.fecha_creacion.toDateString()));
        formData.append('domicilio_legal', this.state.domicilio_legal);
        formData.append('domicilio_real', this.state.domicilio_real);
        formData.append('email_apoderado', this.state.email_apoderado);
        formData.append('socios', socios);
        formData.append('archivo_estatuto', this.state.archivo_estatuto);
        //formData.append('paises_estados', paises_estados);



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
                if (data.error) alert("Datos incorrectos")
                else {
                    console.log(data);
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
                                    onChange={handleChange}
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
                                        onChange={cambiarFecha}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    helperText="[Texto de ayuda]"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth={true}>
                                <TextField
                                    name="email_apoderado"
                                    id="email_apoderado"
                                    placeholder="juan@gmail.com"
                                    label="Email del apoderado"
                                    required={true}
                                    value={this.state.email_apoderado}
                                    onChange={handleChange}
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
                                    {generarFormsSocios()}
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
                                    onClick={habilitarFormSocio}
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

                    {/* Países a los que exporta */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <p>Seleccioná el o los países a los que exporta la sociedad. Luego, para cada país, los estados.</p>
                        </Grid>
                        {this.state.cantPaises > 0 ?
                            <Grid item xs={12}>
                                <FormsPaises
                                    cantPaises={this.state.cantPaises}
                                    handleChangePais={handleChangePais}
                                    handleChangeInputPais={handleChangeInputPais}
                                    state={this.state}
                                    removerPais={removerPais}

                                    handleChangeEstados={handleChangeEstados}
                                    handleChangeInputEstados={handleChangeInputEstados}
                                />
                            </Grid>
                            :
                            <Grid item xs={12}>
                                <span>Se asignará Argentina como país por defecto.</span>
                            </Grid>
                        }
                    </Grid>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        {/* Botón para agregar otro país */}
                        <Grid item xs={3}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={habilitarFormPais}
                            >Agregar otro país
                            </Button>
                        </Grid>
                        <Grid item xs={5}>
                            <Button onClick={armarJSONPaisesYEstados} variant="outlined">
                                Mostrar JSON paises en consola
                            </Button>
                        </Grid>
                    </Grid>

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
                                    onChange={handleChangeEstatuto}
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
                                onClick={handleSubmit}
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