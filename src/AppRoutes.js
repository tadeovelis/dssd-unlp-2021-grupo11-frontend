import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import DashboardContainer from "views/DashboardContainer";


// Sección Opciones predefinidas
const Home = lazy(() => import("views/Home.js"));

const ApoderadoDashboard = lazy(() => import("views/ApoderadoDashboard.js"));
const ApoderadoRegistrarSociedadAnonima = lazy(() => import("views/ApoderadoRegistrarSociedadAnonima.js"));
const ApoderadoCorregirSociedadAnonima = lazy(() => import("views/ApoderadoCorregirSociedadAnonimaNuevo.js"));

const MesaDeEntradasDashboard = lazy(() => import("views/MesaDeEntradasDashboard.js"));

const EscribanoDashboard = lazy(() => import("views/EscribanoDashboard.js"));

const InfoPublicaSociedad = lazy(() => import("views/InfoPublicaSociedad.js"));


class AppRoutes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Suspense fallback={<div></div>}>
                <Switch>
                    {/* Home, Login y registro */}
                    <Route exact path="/" component={Home} />

                    {/* Apoderado */}
                    <Route
                        exact path="/apoderado/inicio"
                        render={(props) => (
                            <DashboardContainer {...props} componente={<ApoderadoDashboard {...props}/>}/>
                            )
                        }
                    />
                    <Route
                        exact path="/apoderado/registrar-sociedad-anonima"
                        render={(props) => (
                            <DashboardContainer {...props} componente={<ApoderadoRegistrarSociedadAnonima {...props}/>}/>
                            )
                        }
                    />
                    <Route
                        exact path="/apoderado/corregir-sociedad-anonima"
                        render={(props) => (
                            <DashboardContainer {...props} componente={<ApoderadoCorregirSociedadAnonima {...props}/>}/>
                            )
                        }
                    />

                    {/* Mesa de Entradas */}
                    <Route
                        exact path="/empleado-mesa-de-entradas/inicio"
                        render={(props) => (
                            <DashboardContainer {...props} componente={<MesaDeEntradasDashboard {...props}/>}/>
                            )
                        }
                    />

                    {/* Escribano */}
                    <Route
                        exact path="/escribano-area-legales/inicio"
                        render={(props) => (
                            <DashboardContainer {...props} componente={<EscribanoDashboard {...props}/>}/>
                            )
                        }
                    />


                    {/* Info pública de una sociedad */}
                    <Route
                        path="/sa/"
                        render={(props) => (
                            <DashboardContainer {...props} componente={<InfoPublicaSociedad {...props}/>}/>
                            )
                        }
                    />

                    <Redirect to="/" />
                </Switch>
            </Suspense>
        );
    }
}

export default AppRoutes;
