import { Box } from "@mui/system";
import { Paper, Typography, Grid, FormControl, TextField, Button } from "@mui/material";
import { useState } from "react";


export function BuscadorPublicoSociedad(props) {

    const [hash, setHash] = useState('');

    const handleChange = (e) => {
        setHash(e.target.value)
    }

    const handleSubmit = (e) => {
        alert("Todavía no implementado");
        e.preventDefault();
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12}>
                    <Typography
                        sx={{
                            fontSize: 18
                        }}
                    >Ver los datos públicos de una sociedad anónima
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <FormControl>
                        <TextField
                            name="hash"
                            id="hash"
                            placeholder="Ingresá el número de hash"
                            label="Número de hash"
                            required={true}
                            value={hash}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="outlined"
                        onClick={handleSubmit}
                    >
                        Buscar
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}