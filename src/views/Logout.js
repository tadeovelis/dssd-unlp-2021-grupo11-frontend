import { Button } from '@mui/material';
import { useHistory } from 'react-router';
import { useTheme } from '@mui/material';

export default function Logout(props) {

    const history = useHistory();
    const theme = useTheme();

    const handleClick = () => {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }

        history.push('/login')
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