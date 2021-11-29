import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


// Para cambiar los colores globales de Material UI
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import "assets/css/material-dashboard-react.css?v=1.10.0";

import App from "App";

// Apollo client - GraphQL
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

// React-cookie
import { CookiesProvider } from "react-cookie";

const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com',
  cache: new InMemoryCache()
});

// Or Create your Own theme:
const theme = createTheme({
  palette: {
    primary: {
      /* verde
      main: "#4ebc58",
      contrastText: '#ffffff'
      */
      main: "#36b582",
      contrastText: '#ffffff'
    },
    secondary: {
      //main: "#6783FF"
      main: '#4378d4'
    },
    white: {
      main: '#ffffff',
      contrastText: '#4ebc58'
    },

  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    }

  }

});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </ApolloProvider>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById("root")
);
