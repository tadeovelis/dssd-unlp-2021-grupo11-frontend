import { Button, Divider, Grid, Link, SvgIcon, Tooltip, Typography } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';


export default function MostrarSociedadInfoEspecificaEscribano(props) {

    const s = props.sociedad;

    return (
        <Grid item xs={12}>
            <Grid container spacing={1}>
                <Grid item>
                    <DescriptionIcon />
                </Grid>
                <Grid item>
                    <Typography sx={{ fontSize: 18 }}>
                        Carpeta de Google Drive con el estatuto en formato PDF
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ mb: 1, width: '95%' }} />
            </Grid>
            <Grid item xs={12}>
                <Tooltip placement="right" title="Contiene el estatuto en formato PDF">
                    <Button href={s.url_carpeta_estatuto} target="_blank" variant="text" startIcon={
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
        </Grid>
    )
}