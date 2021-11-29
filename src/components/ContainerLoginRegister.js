import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useState } from "react";
import Login from "./Login";
import Registro from "./Registro";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export function ContainerLoginRegister(props) {

    const [quieroRegistrar, setQuieroRegistrar] = useState(false);



    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                background: '#f1f6f7',
                px: 8,
                py: 8,
                boxShadow: 3,
                mr: 6
            }}
        >
            {!quieroRegistrar ?
                <Login
                    setQuieroRegistrar={() => setQuieroRegistrar(true)}
                />
                : (
                    <>
                        <Box textAlign="left">
                            <Box>
                                <Button
                                    onClick={() => setQuieroRegistrar(false)}
                                    variant="outlined"
                                    startIcon={
                                        <ArrowBackIosIcon />
                                    }
                                >
                                    Volver al login
                                </Button>
                            </Box>
                        </Box>
                        <Registro />
                    </>
                )
            }
        </Box>
    )
}