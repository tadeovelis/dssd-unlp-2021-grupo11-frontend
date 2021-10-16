import { React, Component } from 'react';

import Header from '../components/Header';

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