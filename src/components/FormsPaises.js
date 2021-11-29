// Apollo client - GraphQL
import {
    useQuery,
    gql
} from "@apollo/client";


import { Grid, Autocomplete, TextField, Button } from '@mui/material';
import { useEffect, useState } from "react";

import { FormEstados } from './FormEstados';

// Query de GraphQL de países
const GET_PAISES = gql`
    query GetPaises {
        countries {
            code
            name
            continent {
                name
            }
        }
    }
`;

// Query de GraphQL de Argentina (para setear por defecto)
const GET_ARGENTINA = gql`
    query GetArgentina {
        country(code: "AR") {
            code
            name
            continent {
                name
            }
            states {
                name
            }
        }
    }  
`;


export function FormsPaises(props) {

    const paises = useQuery(GET_PAISES);

    // Hasta que no refactorice todo, necesito llamar a la query desde este componente
    // y setearlo en el componente ApoderadoRegistrarSociedadAnonima
    const argentina = useQuery(GET_ARGENTINA, {
        onCompleted: (data) => {
            props.setearArgentinaPorDefecto(data);
        }
    });

    //if (loadingArgentina) return 'Cargando países...';
    //if (errorArgentina) return `¡Error! ${errorPaises.message}`;
    if (paises.loading) return 'Cargando países...';
    if (paises.error) return `¡Error! ${paises.error.message}`;

    const handleChangeEstados = (e, estados, numPais) => {
        props.handleChangeEstados(e, estados, numPais);
    }

    const handleChangeInputEstados = (e, inputEstados, numPais) => {
        props.handleChangeInputEstados(e, inputEstados, numPais);
    }


    const setPaisSinOpcionesDeEstados = (numPais, bool) => {
        props.setPaisSinOpcionesDeEstados(numPais, bool);
    }


    // Generar forms de los países
    let forms = [];
    let pais = '';
    let inputPais = '';
    let estados = '';
    let inputEstados = '';

    for (let i = 0; i < props.cantPaises; i++) {
        pais = 'pais' + (i + 1);
        inputPais = 'inputPais' + (i + 1);
        estados = 'estados' + (i + 1);
        inputEstados = 'inputEstados' + (i + 1);

        forms.push(
            <Grid key={i + 1} sx={{ mb: 2 }} container spacing={3} justifyContent="flex-start" alignItems="center">
                <Grid item>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#fa0000', 'color': 'white' }}
                        onClick={(event) => props.removerPais(event, i + 1)}
                    >Remover
                    </Button>
                </Grid>
                <Grid item>
                    <Autocomplete
                        onChange={(event, pais) => props.handleChangePais(event, pais, i + 1)}
                        value={props.state[pais]}
                        inputValue={props.state[inputPais]}
                        onInputChange={(event, inputPais) => {
                            props.handleChangeInputPais(event, inputPais, i + 1)
                        }
                        }
                        loading={paises.loading}
                        id="select-pais"
                        placeholder="Buscá el país"
                        sx={{ width: 300 }}
                        renderInput={(params) =>
                            <TextField {...params} label="País" required />
                        }
                        options={paises.data.countries}
                        getOptionLabel={(option) => option.name ? option.name : ""}
                    />
                </Grid>
                {props.state[pais] &&
                    <FormEstados
                        pais={props.state[pais]}
                        numPais={i + 1}
                        handleChangeEstados={handleChangeEstados}
                        handleChangeInputEstados={handleChangeInputEstados}
                        state={props.state}
                        setPaisSinOpcionesDeEstados={setPaisSinOpcionesDeEstados}
                    />
                }
            </Grid>
        )
    }

    return (forms)
}