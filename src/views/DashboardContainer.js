import { React, Component } from 'react';

import { Container } from '@mui/material';
import Header from './Header';

export default class DashboardContainer extends Component {
    constructor(props) {
        super(props);

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