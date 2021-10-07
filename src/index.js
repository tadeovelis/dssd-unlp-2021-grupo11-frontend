/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


// Para cambiar los colores globales de Material UI
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import "assets/css/material-dashboard-react.css?v=1.10.0";

import App from "App";

// Or Create your Own theme:
const theme = createTheme({
  palette: {
    primary: {
      main: "#4ebc58",
      contrastText: '#ffffff'
    },
    secondary: {
      //main: "#6783FF"
      main: '#4378d4'
    }
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
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById("root")
);
