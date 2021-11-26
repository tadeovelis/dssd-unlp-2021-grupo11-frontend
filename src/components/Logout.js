import { Button } from '@mui/material';
import { useHistory } from 'react-router';
import { useTheme } from '@mui/material';

import env from "@beam-australia/react-env";
import { getCookie } from 'helpers/helpers';
import { borrarCookies } from 'helpers/helpers';


export default function Logout(props) {

    const history = useHistory();
    const theme = useTheme();

    const handleClick = () => {
        var ruta = 'api/auth/logout';

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getCookie("access_token")
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) alert("Ocurrió un error")
                else {
                    
                    borrarCookies();

                    history.push({
                        pathname: '/',
                        state: { logoutExitoso: true }
                    })
                }
            })
            .catch(error => console.error(error));

    }

    return (
        <Button
            color="white"
            variant="contained"
            onClick={handleClick}
        >
            Cerrar sesión
        </Button>
    )
}