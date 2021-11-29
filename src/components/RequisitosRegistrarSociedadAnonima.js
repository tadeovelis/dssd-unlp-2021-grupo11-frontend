import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';


export default function RequisitosRegistrarSociedadAnonima(props) {
    return (
        <>
            <Typography>Recordá que necesitás tener la siguiente información:</Typography>
            <List dense={true}>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <ApartmentIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Nombre de la S.A."
                    />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <EventIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Fecha de creación"
                    />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <RoomIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Domicilio legal"
                    />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <RoomIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Domicilio real"
                    />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Email del apoderado"
                    />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <GroupIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Información de los socios"
                    />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <PublicIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Países y estados a los que exporta"
                    />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: '15%' }}>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Estatuto en formato docx, PDF u ODT"
                    />
                </ListItem>
            </List>
        </>
    )
}