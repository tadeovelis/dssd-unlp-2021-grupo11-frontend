/*

Alert
-----

Recibe las props:

- open (booolean, si está true se muestra)
- onClose (se ejecuta cuando se intenta cerrar)
- title
- text
- severity (determina el color, puede ser "success", "warning", "error", "info" o un string. Por defecto va info)
- variant (puede ser "outlined" o "filled". Por defecto va standard)

*/

import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useEffect } from "react";


export function MyAlert(props) {

    return (
        <>
            <Snackbar
                open={props.open}
                onClose={props.onClose}
                sx={{ width: '80%' }}
                spacing={2}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    variant={props.variant ? props.variant : "standard"}
                    severity={props.severity ? props.severity : "info"}
                    onClose={props.onClose}
                    closeText={'Cerrar'}
                >
                    <AlertTitle>{props.title}</AlertTitle>
                    {props.text}
                </Alert>
            </Snackbar>
        </>
    )
}