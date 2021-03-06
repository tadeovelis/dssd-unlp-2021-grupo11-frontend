import { React, Component } from 'react';

import { Box, AppBar, Toolbar, IconButton, Typography, Slide, useScrollTrigger } from '@mui/material';
import Logout from './Logout';
import { UserInfo } from './UserInfo';
import { withCookies } from 'react-cookie';


function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { cookies } = this.props;

        return (
            <Box sx={{ flexGrow: 1 }}>
                <HideOnScroll {...this.props}>
                    {/* Sacar position para que tome la función de hideonscroll, pero tapa el fondo */}
                    <AppBar position="relative">
                        <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: 800 }}>Dirección Nacional de Personas Jurídicas</Typography>
                            </Box>
                            {cookies.get('name') && (<>
                                <Box>
                                    <Logout />
                                </Box>
                                <Box>
                                    <UserInfo />
                                </Box>
                            </>)}
                        </Box>
                    </AppBar>
                </HideOnScroll>
            </Box>
        )

    }
}

export default withCookies(Header);
