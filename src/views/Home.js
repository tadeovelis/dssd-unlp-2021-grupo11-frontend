import { Divider, Grid, Typography } from "@mui/material";
import { BuscadorPublicoSociedad } from "./BuscadorPublicoSociedad";
import Login from "./Login";
import { Box } from "@mui/system";


export default function Home(props) {

    return (
        <Grid container
            sx={{
                bgcolor: 'primary.main',
            }}>
            <Grid item xs={7} py={10} pl={8} pr={16}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontWeight: 500,
                                letterSpacing: '2pt !important',
                                fontSize: 14,
                            }}
                            variant="subtitle1"
                            color="#fafafa"
                        >
                            Dirección Nacional de Personas Jurídicas
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ bgcolor: "#0b3a51", height: 10, width: '30%', borderRadius: '0 1000px 50px 0' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontWeight: 400,
                                lineHeight: 1
                            }}
                            variant="h2"
                            color="primary.contrastText"
                        >
                            Sistema de Registro de Sociedad Anónima
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{mt: 8}}>
                    <BuscadorPublicoSociedad />
                </Box>

            </Grid>
            <Grid item xs={5}>
                <Login />
            </Grid>
        </Grid>
    )
}