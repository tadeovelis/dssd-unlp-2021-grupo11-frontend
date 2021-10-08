import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
/*
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';
*/

import { Button } from '@mui/material';

class App extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.onRouteChanged();
    }
    render() {
        /*
        let navbarComponent = !this.state.isFullPageLayout ? <Navbar breadcrumb={this.state.breadcrumbHeader}/> : '';
        let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar/> : '';
        let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';
        */
        return (
            <div>
                <AppRoutes />
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