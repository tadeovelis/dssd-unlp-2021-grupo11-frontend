
import { estoyEnUnDashboard } from 'helpers/helpers';
import { userLogueado } from 'helpers/helpers';
import { React, Component } from 'react';

import Header from '../components/Header';

export default class DashboardContainer extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // Si estoy en un dashboard pero sin estar logueado
        // entonces redirecciono al Home.
        if (estoyEnUnDashboard(this.props.location.pathname)) {
            if (!userLogueado()) {
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