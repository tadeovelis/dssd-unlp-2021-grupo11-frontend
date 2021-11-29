import { React, Component } from "react";

import { Container, Grid, Paper, FormControl, TextField, Divider, FormControlLabel, Alert } from '@mui/material';
import { Box, Button, Checkbox, CircularProgress } from "@mui/material";

import DescriptionIcon from '@mui/icons-material/Description';

import { es } from "date-fns/locale";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import 'assets/css/apoderado-registro-sa.css';
import 'assets/css/dashboard.css';

import env from "@beam-australia/react-env";

import { MyAlert } from "../components/MyAlert";

import { FormsPaises } from "../components/FormsPaises.js";
import { formatDate } from "helpers/helpers.js";

import { withCookies } from "react-cookie";


const formatosValidosEstatuto = 'application/pdf,' +
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
    'application/vnd.oasis.opendocument.text';


class ApoderadoCorregirSociedadAnonima extends Component {
    constructor(props) {
        super(props);

        this.state = {

            // access_token desde las cookies|
            access_token: this.props.cookies.get('access_token'),

            // Generales
            nombre: '',
            fecha_creacion: null,
            domicilio_legal: '',
            domicilio_real: '',
            email_apoderado: '',

            // Socios
            cantSocios: 1,
            socio1: { apellido: '', nombre: '', porcentaje: "", apoderado: 'false' },

            // Estatuto
            archivo_estatuto: null,

            // Validaciones
            todosLosDatosCompletados: false,
            sociosCompletados: false,

            // Iconito de carga
            activarCircularProgress: false,

            // Países y estados
            argentina: '',
            pais1: '',
            inputPais1: '',
            cantPaises: 1,
            estados1: [],
            inputEstados1: '',
            paisSinOpcionesDeEstados1: false,
            paisesYEstadosCargados: false,

            // Alert
            mostrarAlert: false,
            alertTitle: "",
            alertSeverity: "",
            alertVariant: "",
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
        this.setearArgentinaPorDefecto = this.setearArgentinaPorDefecto.bind(this);

        this.handleChangePais = this.handleChangePais.bind(this);
        this.handleChangeInputPais = this.handleChangeInputPais.bind(this);
        this.removerPais = this.removerPais.bind(this);
        this.habilitarFormPais = this.habilitarFormPais.bind(this);

        this.handleChangeEstados = this.handleChangeEstados.bind(this);
        this.handleChangeInputEstados = this.handleChangeInputEstados.bind(this);
        this.armarJSONPaisesYEstados = this.armarJSONPaisesYEstados.bind(this);
        this.armarJSONArgentina = this.armarJSONArgentina.bind(this);

        this.porcentajesSociosCorrectos = this.porcentajesSociosCorrectos.bind(this);
        this.noMostrarAlert = this.noMostrarAlert.bind(this);
        this.mostrarAlertPorcentajesSociosNoCorrectos = this.mostrarAlertPorcentajesSociosNoCorrectos.bind(this);
        this.mostrarAlertMinimoUnSocio = this.mostrarAlertMinimoUnSocio.bind(this);
        this.mostrarAlertMaximoUnApoderado = this.mostrarAlertMaximoUnApoderado.bind(this);

        this.setPaisSinOpcionesDeEstados = this.setPaisSinOpcionesDeEstados.bind(this);

        this.hayApoderado = this.hayApoderado.bind(this);

    }


    /* ----------------------------------------------------------------
        Métodos para actualizar los forms con los datos de la sociedad
    */

    componentDidMount() {
        // Actualizar todos los campos con la información de la sociedad
        let s = this.props.location.state.sociedad;
        this.setState({
            ...this.state,
            nombre: s.nombre,
            fecha_creacion: s.fecha_creacion,
            domicilio_legal: s.domicilio_legal,
            domicilio_real: s.domicilio_real,
            email_apoderado: s.email_apoderado,
        }, () => {
            // Actualizar el estado y forms de socios
            this.actualizarSocios(s);
            // Actualizar el estado y forms de paises y estados
            this.actualizarPaisesYEstados(s);
        });
    }

    actualizarSocios(s) {
        for (let i = 0; i < s.socios.length; i++) {
            let soc = 'socio' + (i + 1);
            let apoderado = (s.socios[i].id === s.apoderado_id) ? 'true' : 'false';
            this.setState({
                [soc]: {
                    apellido: s.socios[i].apellido,
                    nombre: s.socios[i].nombre,
                    porcentaje: s.socios[i].porcentaje,
                    apoderado: apoderado,
                }
            }, () => {
                if (i === s.socios.length - 1) {
                    // Habilitar el armado de los forms de los socios
                    this.setState({ cantSocios: s.socios.length, sociosCargados: true }, () => {
                        // Actualizar botón final
                        this.validarSiEstanTodosLosDatosCompletados();
                    })
                }
            })
        }
    }

    actualizarPaisesYEstados(s) {
        let paisesYEstados = this.agruparEstadosPorPais(s);
        for (let i = 0; i < paisesYEstados.length; i++) {
            let pais = 'pais' + (i + 1);
            let inputPais = 'inputPais' + (i + 1);
            let estados = 'estados' + (i + 1);
            let inputEstados = 'inputEstados' + (i + 1);
            this.setState({
                [pais]: {
                    '__typename': 'Country',
                    'code': paisesYEstados[i].code,
                    'name': paisesYEstados[i].nombre,
                    'continent': {
                        'name': paisesYEstados[i].continente,
                        '__typename': 'Continent'
                    },

                },
                [inputPais]: paisesYEstados[i].nombre,
                [estados]: paisesYEstados[i].estados,
                [inputEstados]: '',
            })
        }

        this.setState({
            cantPaises: paisesYEstados.length
        }, () => this.setState({ paisesYEstadosCargados: true }))
    }

    terminarYGuardarPais(paisObj, estados, paises, paisesConEstados) {
        paisObj.estados = estados; // le agrego los estados al obj del pais
        paises.push(paisObj); // Pusheo el pais al array
        paisesConEstados.push(paisObj.nombre) // Pusheo el nombre del pais al array de paises con estados
    }

    buscarCode(s, pais) {
        for (let i = 0; i < s.geo.paises.length; i++) {
            if (s.geo.paises[i].name === pais) {
                return s.geo.paises[i].code
            }
        }
    }

    agruparEstadosPorPais(s) {
        let paisObj = {};
        let paises = [];
        let pais = '';
        let estados = [];
        let paisesConEstados = []; // para después chequear si hay países sin estados
        let code = ''; // el code del país
        for (let i = 0; i < s.geo.estados.length; i++) {
            if (pais === '') {
                pais = s.geo.estados[i].pais;
                code = this.buscarCode(s, pais);
                paisObj = {
                    nombre: pais,
                    continente: s.geo.estados[i].continente,
                    code: code
                };
            }

            // Si tengo que cambiar de país pero no es el último...
            if (s.geo.estados[i].pais !== pais) {
                this.terminarYGuardarPais(paisObj, estados, paises, paisesConEstados);

                pais = s.geo.estados[i].pais; // Seteo el nuevo país
                code = this.buscarCode(s, pais);
                estados = []; // Reseteo el array de estados por país
                // Reseteo el object del país
                paisObj = {
                    nombre: pais,
                    continente: s.geo.estados[i].continente,
                    code: code
                };
            }
            estados.push(s.geo.estados[i]); // Le agrego el primer estado

            // Si es el último estado y, por ende, el último país también...
            if (i === s.geo.estados.length - 1) {
                this.terminarYGuardarPais(paisObj, estados, paises, paisesConEstados);
            }
        }

        // Ahora agregamos los países que no tienen estados (si es que hay)
        if (paises.length !== s.geo.paises.length) {
            for (let i = 0; i < s.geo.paises.length; i++) {
                if (!paisesConEstados.includes(s.geo.paises[i].name)) {
                    // Si existe un país sin estados entonces armo el obj
                    paisObj = {
                        nombre: s.geo.paises[i].name,
                        continente: s.geo.paises[i].continente,
                        code: s.geo.paises[i].code,
                        estados: []
                    };
                    // y lo pusheo al array que estamos armando
                    paises.push(paisObj);
                }
            }
        }
        return paises
    }



    // Método que invoca el componente hijo FormPaises cuando se ejecuta por primera vez
    setearArgentinaPorDefecto(dataArgentina) {
        this.setState({
            argentina: dataArgentina.country
        })
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

        if (valor === "true" && this.yaHayUnApoderado()) {
            this.mostrarAlertMaximoUnApoderado();
        }
        else {
            this.setState({
                [socio]: { ...this.state[socio], [e.target.name]: valor }
            }, () => {
                this.validarSiEstanTodosLosDatosCompletados()
            })
        }
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

    // Oculta el alert
    noMostrarAlert() {
        this.setState({
            mostrarAlert: false
        })
    }




    /*  --------------------------------------------------
        Métodos para manejar los forms de países y estados
    */

    // Métodos que le paso como props a FormsPaises
    handleChangePais(e, pais, numPais) {
        this.resetEstados(numPais);
        let p = 'pais' + numPais;
        this.setState({
            [p]: pais
        }, () => {
            console.log(pais);
            this.validarSiEstanTodosLosDatosCompletados()
        });
    }
    handleChangeInputPais(e, inputPais, numPais) {
        let iP = 'inputPais' + numPais;
        this.setState({
            [iP]: inputPais
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }

    handleChangeEstados(e, estados, numPais) {
        let es = 'estados' + numPais;
        this.setState({
            [es]: estados
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }
    handleChangeInputEstados(e, inputEstados, numPais) {
        let iEs = 'inputEstados' + numPais;
        this.setState({
            [iEs]: inputEstados
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }
    // Reset forms de estados cuando se cambia el país
    resetEstados(numPais) {
        let estados = 'estados' + numPais;
        let inputEstados = 'inputEstados' + numPais;
        this.setState({
            [estados]: [],
            [inputEstados]: ''
        })
    }

    // Algoritmo para borrar un form de un país y que se reordene todo el estado
    removerPais(e, numPais) {
        if (this.state.cantPaises === 1) {
            this.setState({
                pais1: '',
                inputPais1: '',
                estados1: [],
                inputEstados1: '',
                paisSinOpcionesDeEstados1: false,
            });
        }
        else {
            let pais = '';
            let inputPais = '';
            let nextPais = '';
            let nextInputPais = '';
            let estados = '';
            let inputEstados = '';
            let nextEstados = '';
            let nextInputEstados = '';
            let paisSinOpcionesDeEstados = false;
            let nextPaisSinOpcionesDeEstados = false;
            for (let i = numPais; i < this.state.cantPaises; i++) {
                pais = 'pais' + i;
                inputPais = 'inputPais' + i;
                nextPais = 'pais' + (i + 1);
                nextInputPais = 'inputPais' + (i + 1);
                estados = 'estados' + i;
                inputEstados = 'inputEstados' + i;
                nextEstados = 'estados' + (i + 1);
                nextInputEstados = 'inputEstados' + (i + 1);
                paisSinOpcionesDeEstados = 'paisSinOpcionesDeEstados' + i;
                nextPaisSinOpcionesDeEstados = 'paisSinOpcionesDeEstados' + (i + 1);
                let nextPaisState = this.state[nextPais];
                let nextInputPaisState = this.state[nextInputPais];
                let nextEstadosState = this.state[nextEstados];
                let nextInputEstadosState = this.state[nextInputEstados];
                let paisSinOpcionesDeEstados = this.state[paisSinOpcionesDeEstados];
                let nextPaisSinOpcionesDeEstados = this.state[nextPaisSinOpcionesDeEstados];
                this.setState({
                    [pais]: nextPaisState,
                    [inputPais]: nextInputPaisState,
                    [estados]: nextEstadosState,
                    [inputEstados]: nextInputEstadosState,
                    [paisSinOpcionesDeEstados]: nextPaisSinOpcionesDeEstados
                });
            };
        }
        this.setState({
            cantPaises: this.state.cantPaises - 1
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }
    // Prepara un nuevo país vacío para que la función que arma los forms prepare otro
    habilitarFormPais() {
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
            this.setState({
                cantPaises: this.state.cantPaises + 1
            }, () => this.validarSiEstanTodosLosDatosCompletados())
        });
    }

    // Se arma el JSON para mandar a la API
    armarJSONPaisesYEstados() {
        let paises = [];
        if (this.state.cantPaises > 0) {
            for (let i = 0; i < this.state.cantPaises; i++) {
                let pais = 'pais' + (i + 1);
                let estados = 'estados' + (i + 1);
                if (this.state[pais]) {
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
        }
        else {

        }
        let jsonPaises = JSON.stringify(paises);
        return jsonPaises;
    }

    // Arma el JSON de Argentina por defecto (si no se elige ningún país o estado)
    armarJSONArgentina() {
        if (this.state.argentina) {
            return (JSON.stringify([{
                'code': this.state.argentina.code,
                'name': this.state.argentina.name,
                'continent': this.state.argentina.continent.name,
                'estados': this.state.argentina.states
            }]))
        }
        return false
    }

    // Con esto seteo en el estado un paisSinOpcionesDeEstados{numPais}
    // para que al validar no lo tome como un campo vacío
    setPaisSinOpcionesDeEstados(numPais, bool) {
        let pais = 'paisSinOpcionesDeEstados' + (numPais);
        this.setState({
            [pais]: bool
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }



    /* ----------------------------------------------
        Métodos para manejar los forms de los socios
    */

    // Maneja los cambios de los forms de los socios
    handleChangeSocio(e) {
        let socio = 'socio' + e.currentTarget.getAttribute('data-numdesocio');
        this.setState({
            [socio]: { ...this.state[socio], [e.target.name]: e.target.value }
        }, () => this.validarSiEstanTodosLosDatosCompletados())
    }

    // Prepara un nuevo socio vacío para que la función que arma los forms prepare otro
    habilitarFormSocio() {
        let socio = 'socio' + (this.state.cantSocios + 1);
        this.setState({
            [socio]: { apellido: '', nombre: '', porcentaje: "", apoderado: 'false' }
        }, () => {
            this.setState({ cantSocios: this.state.cantSocios + 1 }, () => this.validarSiEstanTodosLosDatosCompletados())
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
            }, () => this.validarSiEstanTodosLosDatosCompletados())
        }
        else {
            this.mostrarAlertMinimoUnSocio()
        }
    }

    // Generar forms de los socios
    generarFormsSocios() {
        let forms = [];
        let soc = '';
        for (let i = 0; i < this.state.cantSocios; i++) {
            soc = 'socio' + (i + 1);
            forms.push(
                <Grid item xs={12}>
                    <Grid key={i} container spacing={3} justifyContent="flex-start" alignItems="center">
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
                                    //helperText="[Texto de ayuda]"
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
                                    //helperText="[Texto de ayuda]"
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
                                    placeholder="Entre 0.01 y 100"
                                    label="Porcentaje"
                                    required={true}
                                    value={this.state[soc].porcentaje}
                                    onChange={this.handleChangeSocio}
                                    //helperText="Entre 0 y 100"
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
                                            checked={this.state[soc].apoderado === "true" ? true : false}
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
                </Grid>
            )
        }
        return (
            <Grid container spacing={2}>
                {forms}
            </Grid>
        )
    }

    // Arma un JSON con los socios para la API
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
            return jsonSocios
        }
    }

    // Me dice si la suma de porcentajes da 100 o no
    porcentajesSociosCorrectos() {
        let suma = 0;
        for (let i = 0; i < this.state.cantSocios; i++) {
            let soc = 'socio' + (i + 1);
            suma = suma + parseInt(this.state[soc].porcentaje);
        }
        return (suma === 100) ? true : false
    }

    // Seteo algunos alerts par algunas validaciones
    mostrarAlertPorcentajesSociosNoCorrectos() {
        this.setState({
            alertTitle: "Los porcentajes de los socios deben sumar 100",
            alertSeverity: "error",
            alertVariant: "filled",
            mostrarAlert: true
        })
    }
    mostrarAlertMinimoUnSocio() {
        this.setState({
            alertTitle: "La sociedad debe tener como mínimo un socio",
            alertSeverity: "error",
            alertVariant: "filled",
            mostrarAlert: true
        })
    }
    mostrarAlertMaximoUnApoderado() {
        this.setState({
            alertTitle: "La sociedad debe tener sólo un socio apoderado",
            alertSeverity: "error",
            alertVariant: "filled",
            mostrarAlert: true
        })
    }


    /*  -------------------------------------------------------
        Métodos de validación de datos ingresados en los forms
    */

    // Devuelve true si se tildó el apoderado
    hayApoderado() {
        for (let i = 0; i < this.state.cantSocios; i++) {
            let soc = 'socio' + (i + 1);
            if (this.state[soc].apoderado === "true") return true;
        }
        return false
    }

    // Devuelve bool si están o no completos los datos de los socios
    seCompletaronLosSocios() {
        let hayApoderado = false;
        for (let i = 0; i < this.state.cantSocios; i++) {
            let soc = 'socio' + (i + 1);
            if (this.state[soc].apoderado) hayApoderado = true;
            if (this.state[soc].apellido === '' || this.state[soc].nombre === '') {
                return false
            }
        }
        if (hayApoderado) return true
        else return false
    }
    seSubioElEstatuto() {
        return this.state.archivo_estatuto !== null;
    }
    yaHayUnApoderado() {
        let cantApoderados = 0;
        for (let i = 0; i < this.state.cantSocios; i++) {
            let soc = 'socio' + (i + 1);
            if (this.state[soc].apoderado === "true") {
                cantApoderados++;
            }
        }
        if (cantApoderados === 1) return true
        else return false
    }
    seCompletaronLosDatosGenerales() {
        if (this.state.nombre === '' || this.state.fecha_creacion === null ||
            this.state.domicilio_legal === '' || this.state.domicilio_real === '' ||
            this.state.email_apoderado === '') {
            return false
        }
        else return true
    }
    seCompletaronLosPaisesEstados() {
        for (let i = 0; i < this.state.cantPaises; i++) {
            let pais = 'pais' + (i + 1);
            let estados = 'estados' + (i + 1);
            let paisSinOpcionesDeEstados = 'paisSinOpcionesDeEstados' + (i + 1);
            if (!this.state[pais] || this.state[pais] === '') return false
            else if (!this.state[estados].length && !this.state[paisSinOpcionesDeEstados]) {
                return false
            }
        }
        return true
    }

    // Este método me habilita o deshabilita el botón de submit
    validarSiEstanTodosLosDatosCompletados() {
        if (this.seCompletaronLosSocios() &&
            this.seCompletaronLosDatosGenerales() &&
            //this.seSubioElEstatuto() &&
            this.seCompletaronLosPaisesEstados()) {
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


    // El gran submit
    handleSubmit(e) {
        this.setState({
            activarCircularProgress: true
        })

        // Chequear si la suma de porcentajes de los socios da 100
        if (this.porcentajesSociosCorrectos()) {

            let ruta = 'api/sociedadAnonima/' + this.props.location.state.sociedad.id;
            let socios = this.armarJSONSocios();

            let paises_estados = {};
            if (!this.state.pais1 || this.state.pais1.name === "") {
                // O sea no se eligió ninguno, así que asigno a Argentina
                paises_estados = this.armarJSONArgentina();
            }
            else paises_estados = this.armarJSONPaisesYEstados();

            fetch(env("BACKEND_URL") + ruta, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + this.state.access_token
                },
                body: new URLSearchParams({
                    'fecha_creacion': formatDate(new Date(this.state.fecha_creacion).toDateString()),
                    'domicilio_legal': this.state.domicilio_legal,
                    'domicilio_real': this.state.domicilio_real,
                    'email_apoderado': this.state.email_apoderado,
                    'socios': socios,
                    'paises_estados': paises_estados
                })
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
                                correccionDeSAExitoso: true,
                                refreshTramites: true,
                                data: this.props.location.state.data
                            }
                        })
                    }
                })
                .catch(error => console.error(error));
        }
        // Los porcentajes de los socios no suman 100
        else {
            this.mostrarAlertPorcentajesSociosNoCorrectos();
            this.setState({
                activarCircularProgress: false
            })
        }
        e.preventDefault();
    }


    render() {
        return (
            <Container>
                <Box p={2}>
                    <Paper className="dashboard-paper">
                        <span className="apoderado-registrar-sa-titulo">
                            Corrección de solicitud de registro de Sociedad Anónima
                        </span>
                        <p>Modificá los datos que se especificaron en el email.</p>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <FormControl fullWidth={true}>
                                    <TextField
                                        disabled
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
                                                <TextField {...params} helperText="Ej: 24/09/2015" required />
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
                                    //helperText="[Texto de ayuda]"
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
                                    //helperText="[Texto de ayuda]"
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
                                        onChange={this.handleChange}
                                    //helperText="[Texto de ayuda]"
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
                                <Grid item xs={12}>
                                    {!this.hayApoderado() &&
                                        <Alert
                                            severity="warning"
                                            sx={{ maxWidth: 'fit-content' }}
                                        >
                                            Recordá que tiene que haber un socio seleccionado como apoderado
                                        </Alert>
                                    }
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

                        {/* Países a los que exporta */}
                        {this.state.paisesYEstadosCargados &&
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <p>Seleccioná el o los países a los que exporta la sociedad. Luego, para cada país, los estados.</p>
                                </Grid>
                                {this.state.cantPaises > 0 ?
                                    <Grid item xs={12}>
                                        <FormsPaises
                                            setearArgentinaPorDefecto={this.setearArgentinaPorDefecto}
                                            cantPaises={this.state.cantPaises}
                                            handleChangePais={this.handleChangePais}
                                            handleChangeInputPais={this.handleChangeInputPais}
                                            state={this.state}
                                            removerPais={this.removerPais}

                                            handleChangeEstados={this.handleChangeEstados}
                                            handleChangeInputEstados={this.handleChangeInputEstados}

                                            setPaisSinOpcionesDeEstados={this.setPaisSinOpcionesDeEstados}
                                        />
                                    </Grid>
                                    :
                                    <Grid item xs={12}>
                                        <Alert
                                            severity="info"
                                            sx={{
                                                width: "fit-content"
                                            }}
                                        >
                                            Se asignará por defecto <b>Argentina</b> y todos sus estados.
                                        </Alert>
                                    </Grid>
                                }
                            </Grid>
                        }
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            {/* Botón para agregar otro país */}
                            <Grid item xs={3}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={this.habilitarFormPais}
                                >Agregar otro país
                                </Button>
                            </Grid>
                        </Grid>

                        {this.state.estados1 &&
                            <span>{this.state.estados1.name}</span>
                        }

                        <Divider
                            style={{
                                margin: '30px 0px 10px 0px'
                            }}
                        />

                        {/* Componente para el archivo del estatuto */}
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item xs={12}>
                                <p>El estatuto se validará en la próxima instancia, ahora no es necesario que lo modifiques.</p>
                            </Grid>
                            <Grid item xs={2}>
                                <label htmlFor="botonSubirEstatuto">
                                    <TextField
                                        disabled
                                        id='botonSubirEstatuto'
                                        type="file"
                                        inputProps={{ accept: formatosValidosEstatuto }}
                                        style={{ display: 'none' }}
                                        onChange={this.handleChangeEstatuto}
                                        required
                                    />
                                    <Button
                                        disabled
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
                                    Enviar la corrección de la solicitud
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                {this.state.activarCircularProgress && <CircularProgress />}
                            </Grid>
                        </Grid>

                        {/* Alert */}
                        <MyAlert
                            open={this.state.mostrarAlert}
                            onClose={this.noMostrarAlert}
                            title={this.state.alertTitle}
                            severity={this.state.alertSeverity}
                            variant={this.state.alertVariant}
                        />

                    </Paper>
                </Box>
            </Container>
        )
    }
}

export default withCookies(ApoderadoCorregirSociedadAnonima)