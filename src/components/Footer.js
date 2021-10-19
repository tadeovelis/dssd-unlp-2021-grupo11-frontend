import { Typography, IconButton, Grid, Link } from "@mui/material";
import { Box } from "@mui/system";
import GitHubIcon from "@mui/icons-material/GitHub";

import 'hover.css';

import env from "@beam-australia/react-env";
import { useEffect } from "react";

export function Footer(props) {

    return (
        <Box
            sx={{
                display: 'flex',
                py: 1,
                px: 4,
                background: '#1e1e1e',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Box>
                <Typography
                    variant="body2"
                    color="common.white"
                >
                    Grupo 11 - Facultad de Informática (UNLP)
                </Typography>
            </Box>
            <Box>
                <a className="hvr-grow" href={env("GITHUB_REPO_FRONTEND_URL")} target="_blank">
                    <IconButton>
                        <GitHubIcon color="primary" />
                    </IconButton>
                </a>
            </Box>
            <Box>
                <Typography
                    variant="body2"
                    color="common.white"
                >
                    Dirección Nacional de Personas Jurídicas
                </Typography>
            </Box>
        </Box>
    )
}