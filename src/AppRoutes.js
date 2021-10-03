import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";


// Sección Opciones predefinidas
const Login = lazy(() => import("views/Login.js"));
const ApoderadoDashboard = lazy(() => import("views/ApoderadoDashboard.js"));
const ApoderadoRegistrarSociedadAnonima = lazy(() => import("views/ApoderadoRegistrarSociedadAnonima.js"));

class AppRoutes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Suspense fallback={<div></div>}>
                <Switch>
                    {/* Login */}
                    <Route path="/login" component={Login} />

                    <Route path="/apoderado/inicio" component={ApoderadoDashboard} />
                    <Route path="/apoderado/registrar-sociedad-anonima" component={ApoderadoRegistrarSociedadAnonima} />

                    <Redirect to="/login" />

                    {/* Sección Home
                    <Redirect exact to="/" />
                    */}
                </Switch>
            </Suspense>
        );
    }
}

export default AppRoutes;
