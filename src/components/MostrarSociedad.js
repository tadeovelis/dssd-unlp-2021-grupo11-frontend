import { formatDate } from "helpers/helpers";
import { textoEstadoDeEvaluacion } from "helpers/helpers";
import { valorYColorLineaProgreso } from "helpers/helpers";

import { Link } from "react-router-dom";
import { Box, Grid, Typography, Chip, Divider, Button, SvgIcon, Tooltip } from '@mui/material';
import LineaProgresoTramite from "./LineaProgresoTramite";
import GroupIcon from '@mui/icons-material/Group';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PublicIcon from '@mui/icons-material/Public';
import ShareIcon from '@mui/icons-material/Share';
import DescriptionIcon from '@mui/icons-material/Description';


export function MostrarSociedad(props) {

    const s = props.sociedad;

    const mostrarSocios = () => {
        return s.socios.map((ss) =>
            <Grid key={ss.id} item xs={12}>
                <Typography
                    variant="body1"
                >
                    <b>{ss.nombre} {ss.apellido}</b>, con un {ss.porcentaje}% {ss.id == s.apoderado_id ? <Chip label="Apoderado" color="primary" variant="outlined" /> : '.'}
                </Typography>
            </Grid>
        )
    }

    const agruparEstadosPorPais = () => {
        let paisObj = {};
        let paises = [];
        let pais = '';
        let estados = [];
        for (let i = 0; i < s.estados.length; i++) {
            if (pais === '') {
                pais = s.estados[i].pais;
                paisObj = {
                    nombre: pais,
                    continente: s.estados[i].continente
                };
            }
            if (s.estados[i].pais !== pais) {
                paisObj.estados = estados; // le agrego los estados al obj del pais
                paises.push(paisObj); // Pusheo el pais al array

                pais = s.estados[i].pais; // Seteo el nuevo país
                estados = []; // Reseteo el array de estados por país
                // Reseteo el object del país
                paisObj = {
                    nombre: pais,
                    continente: s.estados[i].continente
                };
            }
            estados.push(s.estados[i].name); // Le agrego el primer estado
            if (i === s.estados.length - 1) { // si es el último...
                paisObj.estados = estados; // le agrego los estados al obj del pais
                paises.push(paisObj); // Pusheo el pais al array
            }
        }
        return paises
    }

    const mostrarEstados = () => {
        let paises = agruparEstadosPorPais(s.estados);
        return paises.map((p) =>
            <Grid key={p.nombre} container>
                <Grid item xs={12}>
                    <Typography variant="body1"><strong>{p.nombre}</strong> <i>({p.continente})</i>:{' '}
                        {p.estados.map((e) => {
                            return e === p.estados[p.estados.length - 1] ? e : e + ', '
                        })}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    return (
        <Box
            key={s.id}
            sx={{
                border: '0.1px solid #e8e8e8',
                px: 3,
                py: 2,
                mb: 2
            }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">{s.nombre}</Typography>
                </Grid>
                <Box sx={{ width: '100%', my: 1, mx: 1 }}>
                    <LineaProgresoTramite
                        height={10}
                        value={valorYColorLineaProgreso(s.estado_evaluacion).valor}
                        color={valorYColorLineaProgreso(s.estado_evaluacion).color.string}
                    />
                </Box>
                <Grid item xs={12}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: valorYColorLineaProgreso(s.estado_evaluacion).color.hexa,
                            fontWeight: 800,
                            fontSize: 14,
                            mt: -1,
                        }}
                    >{textoEstadoDeEvaluacion(s, "apoderado")}
                    </Typography>
                </Grid>
                {/* Si tiene que corregir la solicitud... */}
                {s.estado_evaluacion.includes("Rechazado por empleado-mesa") &&
                    props.renderizarCorregirSolicitud(s)
                }
                {/* Si tiene que actualizar el estatuto... */}
                {s.estado_evaluacion.includes("Rechazado por escribano") &&
                    props.renderizarSubidaEstatuto(s)
                }
                {s.url_carpeta_apoderado &&
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <ShareIcon />
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 18 }}>
                                Compartir
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 1, width: '95%' }} />
                    </Grid>
                        <Grid item xs={12}>
                            <Tooltip placement="right" title="Almacena información pública de la sociedad">
                                <Button href={s.url_carpeta_apoderado} target="_blank" variant="text" startIcon={
                                    <SvgIcon {...props}>
                                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                            viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} >
                                            <polygon style={{ fill: '#3089F3' }} points="512,336.842 155.396,336.842 80.842,480.561 431.158,480.561 " />
                                            <polygon style={{ fill: '#00A76A' }} points="170.667,31.439 0,318.877 80.842,480.561 245.221,164.379 " />
                                            <polygon style={{ fill: '#FDD446' }} points="332.351,31.439 170.667,31.439 341.333,336.842 512,336.842 " />
                                        </svg>
                                    </SvgIcon>
                                }>
                                    Ir a la carpeta de Google Drive
                                </Button>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <DescriptionIcon />
                            <Tooltip title="Comparte este link para acceder a la información pública de la S.A." enterDelay={500} leaveDelay={200}>
                                <Button component={Link} to={'/sa/' + s.numero_hash}>{location.protocol + '//' + location.host + /sa/ + s.numero_hash}</Button>
                            </Tooltip>
                        </Grid>
                </Grid>
                }
                <Grid item xs={12} sm={7}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <ApartmentIcon />
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 18 }}>
                                Datos generales
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 1, width: '95%' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Email del apoderado: {s.email_apoderado}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Domicilio legal: {s.domicilio_legal}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Domicilio real: {s.domicilio_real}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Fecha de creación: {formatDate(s.fecha_creacion)}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <GroupIcon />
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 18 }}>
                                Socios
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 1, width: '85%' }} />
                    </Grid>
                    {mostrarSocios()}
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <PublicIcon />
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 18 }}>
                                Países y estados a los que exporta
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 1, width: '85%' }} />
                    </Grid>
                    {mostrarEstados()}
                </Grid>
            </Grid>
        </Box>
    )
}