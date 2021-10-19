import { Footer } from 'components/Footer';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import './assets/css/dashboard.css';

class App extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.onRouteChanged();
    }
    render() {
        return (
            <div>
                <AppRoutes />
                <Footer />
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        window.scrollTo(0, 0);
    }

}

export default withRouter(App);