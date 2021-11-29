import { Avatar, IconButton, Tooltip, Grid, Menu, MenuItem, Divider, Typography } from "@mui/material";
import { useState } from "react";

import PersonIcon from "@mui/icons-material/Person";

import '../assets/css/user-info.css';

import { useCookies } from 'react-cookie';


export function UserInfo(props) {

    const [menu, setMenu] = useState(null);
    const open = Boolean(menu);

    const handleClick = (event) => {
        setMenu(event.currentTarget);
    };
    const handleClose = () => {
        setMenu(null);
    };

    const [ cookies, setCookie ] = useCookies();

    return (
        <>
            <Tooltip title="Información de mi cuenta">
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "common.white" }}>
                        <PersonIcon color="primary" />
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={menu}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Grid container direction="column" spacing={1} sx={{px: 3, py: 2}}>
                    <Grid item xs={5}><span className="nombre">{cookies.name}</span></Grid>
                    <Grid item xs={5}><Divider /></Grid>
                    <Grid item xs={5}><span className="email">Email: {cookies.email}</span><br /></Grid>
                    <Grid item xs={5}><span className="email">Rol: {cookies.rol}</span></Grid>
                </Grid>
            </Menu>
        </>
    )
}