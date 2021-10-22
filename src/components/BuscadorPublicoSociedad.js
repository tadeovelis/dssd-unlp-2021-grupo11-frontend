
import { Paper, Typography, Grid, FormControl, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router";


export default function BuscadorPublicoSociedad(props) {

    const [numHash, setNumHash] = useState('');
    const history = useHistory();

    const handleChangeNumHash = (e) => {
        setNumHash(e.target.value)
    }

    const handleSubmit = (e) => {
        history.push({
            pathname: '/sa/' + numHash,
        })
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>

            <FormControl>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <TextField
                            name="hash"
                            id="hash"
                            placeholder="da39a3ee5e6b4b0d3255bfef95601890afd80709"
                            label="Número de hash de la sociedad"
                            required={true}
                            value={numHash}
                            onChange={handleChangeNumHash}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="white"
                            size="large"
                            type="submit"
                        >
                            Buscar
                        </Button>
                    </Grid>
                </Grid>
            </FormControl>
        </form>
    )
}