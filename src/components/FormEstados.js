import { Grid, Autocomplete, Box, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useEffect, useState } from "react";

// Apollo client - GraphQL
import {
    useQuery,
    gql
} from "@apollo/client";

// Query de GraphQL de estados de un país pasado como parámetro
const GET_ESTADOS = gql`
query GetEstados($code: ID!) {
    country(code: $code) {
        states {
            name
        }
    }
}
`;

export function FormEstados(props) {

    const { loading, error, data } = useQuery(GET_ESTADOS, {
        variables: {
            code: props.pais.code
        },
        /*
        onCompleted: (data) => {
            // Seteo los estados por si no elige ninguno para mandar
            // todos por defecto
            props.handleChangeEstados(0, data.country.states, props.numPais);
        }
        */
    });

    const handleChangeEstados = (event, estados, numPais) => {
        props.handleChangeEstados(event, estados, numPais);
        // Si está vacío envía todos los estados
        /*
        if (estados.length) console.log("tiene algo")
        else console.log("está vacío")
        */
    }

    const [checkboxTodosLosEstados, setCheckboxTodosLosEstados] = useState(false);
    const handleChangeCheckbox = (event) => {
        setCheckboxTodosLosEstados(event.target.checked);
        if (event.target.checked) {
            handleChangeEstados(event, data.country.states, props.numPais);
        }
        else {
            handleChangeEstados(event, [], props.numPais)
        }
    };

    const [paisSinOpcionesDeEstados, setPaisSinOpcionesDeEstados] = useState(false);
    useEffect(() => {
        // Si el país elegido no tiene opciones de estados le aviso al componente del form
        // Para que no lo tome como campo vacío
        if (data && !data.country.states.length) {
            props.setPaisSinOpcionesDeEstados(props.numPais, true);
            setPaisSinOpcionesDeEstados(true);
        }
        else {
            props.setPaisSinOpcionesDeEstados(props.numPais, false);
            setPaisSinOpcionesDeEstados(false);
        }
    }, [data])

    if (loading) return 'Cargando estados...';
    if (error) return `¡Error! ${error.message}`;

    let estados = 'estados' + props.numPais;
    let inputEstados = 'inputEstados' + props.numPais;

    return (
        <>
            <Grid item>
                <Autocomplete
                    fullWidth={true}
                    sx={{ width: '100%' }}
                    multiple
                    onChange={(event, estados) => handleChangeEstados(event, estados, props.numPais)}
                    value={props.state[estados]}
                    inputValue={props.state[inputEstados]}
                    onInputChange={(event, inputEstados) => {
                        props.handleChangeInputEstados(event, inputEstados, props.numPais)
                    }
                    }
                    loading={loading}
                    id="select-estados"
                    placeholder="Buscá los estados"
                    sx={{ width: 300 }}
                    renderInput={(params) =>
                        <TextField
                            fullWidth={true}
                            {...params}
                            label={paisSinOpcionesDeEstados ? "No tiene estados, lo podés dejar en blanco" : "Estados"}
                            required={paisSinOpcionesDeEstados ? false : true}
                        />
                    }
                    options={data.country.states}
                    getOptionLabel={(option) => option.name ? option.name : ""}
                    limitTags={3}
                    clearText="Borrar todos"
                    closeText="Cerrar"
                    openText="Ver estados"
                    noOptionsText="No hay opciones"
                />
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checkboxTodosLosEstados}
                            onChange={handleChangeCheckbox}
                            disabled={paisSinOpcionesDeEstados ? true : false}
                        />
                    }
                    label="Seleccionar todos" />
            </Grid>
        </>
    )
}