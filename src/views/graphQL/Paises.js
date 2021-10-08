// Apollo client - GraphQL
import {
  useQuery,
  gql
} from "@apollo/client";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { propsToClassKey } from "@mui/styles";

// Query de GraphQL
const GET_PAISES = gql`
    query GetPaises {
        countries {
            code
            name
        }
    }
`;

export function Paises({ handleChangePais, handleChangeInputPais, defaultInputPais, pais, inputPais }) {
  const { loading, error, data } = useQuery(GET_PAISES);

  if (loading) return 'Cargando...';
  if (error) return `¡Error! ${error.message}`;


  return (
      <Autocomplete
        onChange={(event, pais) => handleChangePais(event, pais)}
        value={pais}
        inputValue={inputPais}
        onInputChange={(event, inputPais) => {
          handleChangeInputPais(event, inputPais)}
        }
        loading={loading}
        id="select-paises"
        placeholder="Buscá el país"
        sx={{ width: 300 }}
        renderInput={(params) =>
          <TextField {...params} label="País" />
        }
        options={data.countries}
        getOptionLabel={(option) => option.name ? option.name : ""}
      />
  );
}