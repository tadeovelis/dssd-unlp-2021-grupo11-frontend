
import { estoyEnUnDashboard } from 'helpers/helpers';
import { borrarCookies } from 'helpers/helpers';
import { React, Component } from 'react';

import { withCookies, Cookies } from 'react-cookie';

import Header from '../components/Header';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Si estoy en un dashboard pero sin estar logueado
        // entonces redirecciono al Home.
        const { cookies } = this.props;

        if (estoyEnUnDashboard(this.props.location.pathname)) {
            //if (!userLogueado()) {
            if (!cookies.get('name')) {
                console.log("Acceso no autorizado. Redireccionando al home...");
                borrarCookies();
                this.props.history.push({
                    pathname: '/'
                })
            }
        }
    }

    render() {

        return (
            <div>
                <Header />
                {this.props.componente}
            </div>
        )
    }
}

export default withCookies(DashboardContainer)