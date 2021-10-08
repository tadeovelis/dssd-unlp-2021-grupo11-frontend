import { Button } from '@mui/material';
import { useHistory } from 'react-router';

export default function Logout(props) {

    const history = useHistory();
    const handleClick = () => {
        document.cookie = ' JSESSIONID' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = ' X-Bonita-API-Token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        history.push('/login')
    }

    return (
        <Button
            onClick={handleClick}
        >
            Cerrar sesión
        </Button>
    )
}