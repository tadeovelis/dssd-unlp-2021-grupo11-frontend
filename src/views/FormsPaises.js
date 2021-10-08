// Apollo client - GraphQL
import {
    useQuery,
    gql
} from "@apollo/client";


import { propsToClassKey } from "@mui/styles";

import { Grid, Autocomplete, TextField, Button } from '@mui/material';
import { useState } from "react";

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


export function FormsPaises(props) {

    const { loading, error, data } = useQuery(GET_PAISES);

    const handleChangeEstados = (e, estados, numPais) => {
        props.handleChangeEstados(e, estados, numPais);
    }

    const handleChangeInputEstados = (e, inputEstados, numPais) => {
        props.handleChangeInputEstados(e, inputEstados, numPais);
    }


    if (loading) return 'Cargando países...';
    if (error) return `¡Error! ${error.message}`;




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
                        loading={loading}
                        id="select-pais"
                        placeholder="Buscá el país"
                        sx={{ width: 300 }}
                        renderInput={(params) =>
                            <TextField {...params} label="País" />
                        }
                        options={data.countries}
                        getOptionLabel={(option) => option.name ? option.name : ""}
                    />
                </Grid>
                {props.state[pais] &&
                    <FormEstados
                        pais={props.state[pais]}
                        numPais={i+1}
                        handleChangeEstados={handleChangeEstados}
                        handleChangeInputEstados={handleChangeInputEstados}
                        state={props.state}

                    />
                }
            </Grid>
        )
    }

    return (forms)
}