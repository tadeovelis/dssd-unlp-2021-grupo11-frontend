import DescriptionIcon from '@mui/icons-material/Description';
import { Button, CircularProgress, Grid, TextField } from '@mui/material';


const formatosValidosEstatuto = 'application/pdf,' +
'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
'application/vnd.oasis.opendocument.text';

export default function ActualizacionEstatuto(props) {

    // Sociedad
    const { s, handleChangeEstatuto, actualizarEstatuto, estatuto, cargandoSubidaEstatuto } = props;

    return (
        <Grid item xs={12}>
            <Grid container spacing={1}>
                <Grid item xs={5}>
                    <label htmlFor={"botonSubirEstatuto" + s.id}>
                        <TextField
                            id={'botonSubirEstatuto' + s.id}
                            type="file"
                            inputProps={{ accept: formatosValidosEstatuto }}
                            style={{ display: 'none' }}
                            onChange={(e) => handleChangeEstatuto(e, s)}
                            required
                        />
                        <Button
                            variant="outlined"
                            component="span"
                            color="warning"
                            startIcon={<DescriptionIcon />}
                        >
                            Actualizar estatuto
                        </Button>
                    </label>
                </Grid>
                <Grid item xs={7}>
                    {estatuto &&
                        <span>Nombre: {estatuto.name}</span>
                    }
                </Grid>
                <Grid item xs={12} sx={{ mb: 2, fontSize: 15 }}>
                    <span>Recordá que los formatos válidos son: PDF, docx, ODT.</span>
                </Grid>
                {estatuto &&
                    <Grid item xs={12} sx={{ mb: 2, fontSize: 15 }}>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={(e) => actualizarEstatuto(e, s)}
                        >
                            Enviar estatuto actualizado
                        </Button>
                        {cargandoSubidaEstatuto && <CircularProgress />}
                    </Grid>
                }
            </Grid>
        </Grid>
    )
}