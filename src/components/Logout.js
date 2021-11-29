import { Button } from '@mui/material';
import { useHistory } from 'react-router';
import { useTheme } from '@mui/material';

import env from "@beam-australia/react-env";

import { useCookies } from 'react-cookie';


export default function Logout(props) {

    // React-cookie
    const [cookies, setCookie, removeCookie] = useCookies();

    const history = useHistory();
    const theme = useTheme();

    const borrarCookies = () => {
        removeCookie('X-Bonita-API-Token', { path: '/' })
        removeCookie("JSESSIONID", { path: '/' });
        removeCookie("access_token", { path: '/' });
        removeCookie("name", { path: '/' });
        removeCookie("email", { path: '/' });
        removeCookie("rol", { path: '/' });
    }

    const handleClick = () => {
        var ruta = 'api/auth/logout';

        fetch(env("BACKEND_URL") + ruta, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + cookies.access_token
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