import { Button, Divider, Grid, SvgIcon, Tooltip, Typography } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import DescriptionIcon from '@mui/icons-material/Description';
import { Link } from "react-router-dom";


export default function MostrarSociedadInfoEspecificaApoderado(props) {

    const s = props.sociedad;

    return (
        <>
            {/* Si tiene que corregir la solicitud... */}
            {s.estado_evaluacion.includes("Rechazado por empleado-mesa") &&
                props.renderizarCorregirSolicitud(s)
            }
            {/* Si tiene que actualizar el estatuto... */}
            {s.estado_evaluacion.includes("Rechazado por escribano") &&
                props.renderizarSubidaEstatuto(s)
            }
            {/* URL de la carpeta del Drive */}
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
        </>
    )

}