import { Divider, Grid, Typography, Snackbar, Alert, AlertTitle, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import BuscadorPublicoSociedad from "../components/BuscadorPublicoSociedad";
import { Box } from "@mui/system";
import AnchorLink from 'react-anchor-link-smooth-scroll'

import BackgroundImage from 'assets/img/background.jpg';

import Check from '@mui/icons-material/CheckBox';
import { ContainerLoginRegister } from "components/ContainerLoginRegister";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { MyAlert } from "components/MyAlert";


const CheckIcon = () => {
    return (
        <Check
            sx={{
                color: "primary.contrastText",
                fontSize: 30,
            }}
        />
    )
}


export default function Home(props) {

    const [mostrarAlertLogoutExitoso, setMostrarAlertLogoutExitoso] = useState(false);

    useEffect(() => {
        if (props.history.location.state && props.history.location.state.logoutExitoso) {
            setMostrarAlertLogoutExitoso(true);
        }
    }, [props.history.location])

    function noMostrarAlertLogoutExitoso() {
        setMostrarAlertLogoutExitoso(false)
    }

    return (
        <Box>
            <Grid container
                sx={{
                    backgroundImage: `url(${BackgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    boxShadow: 'inset 0 0 0 1000px rgba(54, 181, 130, 0.95)',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}>
                <Grid item xs={7} py={10} pl={8} pr={16}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '2pt !important',
                                    fontSize: 14,
                                }}
                                variant="subtitle1"
                                color="primary.contrastText"
                            >
                                Dirección Nacional de Personas Jurídicas
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    lineHeight: 1,
                                    fontSize: '3.5em'
                                }}
                                variant="h2"
                                color="primary.contrastText"
                            >
                                Sistema de Registro de Sociedad Anónima
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontWeight: 400,
                                    fontSize: '1.1em',
                                    mt: 2
                                }}
                                color="primary.contrastText"
                            >
                                Con este sistema podrás:
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: '1.1em'
                                            }}
                                            color="primary.contrastText"
                                        >
                                            registrar tu Sociedad Anónima
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: '1.1em'
                                            }}
                                            color="primary.contrastText"
                                        >
                                            acceder a la información de forma rápida y cómoda
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: '1.1em'
                                            }}
                                            color="primary.contrastText"
                                        >
                                            consultar el estado del trámite cuando quieras
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider
                                sx={{
                                    mt: 4,
                                    bgcolor: 'common.white',
                                    borderRadius: 450
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    lineHeight: 1.3,
                                    fontSize: '2em',
                                    pr: 6,
                                    mt: 4
                                }}
                                color="primary.contrastText"
                            >
                                ¡Buscá una sociedad!
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 400,
                                    lineHeight: 1.3,
                                    fontSize: '1.1em',
                                    pr: 6
                                }}
                                color="primary.contrastText"
                            >
                                Podés buscar una sociedad y ver su información pública.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <BuscadorPublicoSociedad />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <ContainerLoginRegister />
                </Grid>
            </Grid>

            {/* Alert de logout exitoso */}
            <MyAlert
                open={mostrarAlertLogoutExitoso}
                onClose={noMostrarAlertLogoutExitoso}
                title="Te deslogueaste correctamente"
                severity="success"
                variant="filled"
            />

        </Box>
    )
}