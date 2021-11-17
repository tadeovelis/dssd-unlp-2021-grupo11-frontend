import env from '@beam-australia/react-env';
import download from 'downloadjs';
import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useHistory, useLocation } from 'react-router';
import { pdfjs } from 'react-pdf';
import { Button, CircularProgress, Divider, Grid, Pagination, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { userLogueado } from 'helpers/helpers';
import { getCookie } from 'helpers/helpers';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export default function InfoPublicaSociedad(props) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdf, setPdf] = useState(null);
    const [fileName, setFileName] = useState(null);

    const location = useLocation();
    const history = useHistory();

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function getNroHash() {
        return location.pathname.split("/").pop()
    }

    const handleChange = (event, value) => {
        setPageNumber(value);
    };

    useEffect(() => {
        let nroHash = getNroHash();
        let ruta = 'api/sa/' + nroHash;

        fetch(env("BACKEND_URL") + ruta, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getCookie("access_token")
            }
        })
            .then(response => {
                setFileName(response.headers.get('Content-Disposition').split('filename=')[1])
                return response.blob()
            })
            .then(data => {

                //Create a Blob from the PDF Stream
                let file = new File([data], fileName, {
                    type: "application/pdf"
                });

                setPdf(file);
            })
            .catch(error => console.error(error));
    }, [fileName])


    const document = (
        <Document
            file={pdf ? pdf : null}
            onLoadSuccess={onDocumentLoadSuccess}
        >
            <Page pageNumber={pageNumber} />
        </Document>
    )

    return (
        <div>
            {pdf ? (
                <Box
                    sx={{
                        p: 5,
                        display: 'flex'
                    }}
                >
                    <Box sx={{ ml: 2, mr: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ my: 2 }}>

                                {/* Si no estoy logueado muestro un botón para ir al Home, 
                                sino uno para ir al panel */}
                                {!userLogueado() ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            history.push({
                                                pathname: '/',
                                            })
                                        }}
                                    >
                                        Ir al Home
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            history.push({
                                                pathname: '/' + getCookie("rol") + '/inicio',
                                            })
                                        }}
                                    >
                                        Volver a mi panel
                                    </Button>
                                )}
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => download(pdf, fileName)}
                                >
                                    Descargar
                                </Button>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ my: 2 }}>
                                <Typography sx={{ mb: 2 }}>
                                    Páginas del documento
                                </Typography>
                                <Pagination
                                    count={numPages}
                                    color="primary"
                                    page={pageNumber}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mx: 2 }}>
                        <Divider orientation="vertical" />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            ml: 6,
                            mr: 2
                        }}
                    >
                        {document}
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 15
                    }}
                >
                    <Box sx={{ m: 1 }}><h5>Se está cargando el PDF...</h5></Box>
                    <Box sx={{ m: 1 }}><CircularProgress /></Box>
                </Box>
            )}
        </div>
    );

}