// Apollo client - GraphQL
import {
    useQuery,
    gql
} from "@apollo/client";

import { Grid, Autocomplete, Box, TextField } from '@mui/material';
import { useState } from "react";

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
        }
    });


    if (loading) return 'Cargando estados...';
    if (error) return `¡Error! ${error.message}`;

    let estados = 'estados' + props.numPais;
    let inputEstados = 'inputEstados' + props.numPais;

    return (
        <Grid item xs={6}>
            <Autocomplete
                fullWidth={true}
                sx={{ width: '100%' }}
                multiple
                onChange={(event, estados) => props.handleChangeEstados(event, estados, props.numPais)}
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
                    <TextField fullWidth={true} {...params} label="Estados" />
                }
                options={data.country.states}
                getOptionLabel={(option) => option.name ? option.name : ""}
            />
        </Grid>
    )
}