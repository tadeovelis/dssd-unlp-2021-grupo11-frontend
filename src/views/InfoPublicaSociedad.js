import env from '@beam-australia/react-env';
import download from 'downloadjs';
import { getCookie } from 'helpers/helpers';
import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useHistory, useLocation } from 'react-router';
import { pdfjs } from 'react-pdf';
import { Button, CircularProgress, Divider, Grid } from '@mui/material';
import { Box } from '@mui/system';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



export default function InfoPublicaSociedad(props) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdf, setPdf] = useState(null);

    const location = useLocation();
    const history = useHistory();

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function getNroHash() {
        return location.pathname.split("/").pop()
    }

    useEffect(() => {
        let nroHash = getNroHash();
        let ruta = 'api/sa/' + nroHash;
        console.log(ruta);

        fetch(env("BACKEND_URL") + ruta, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getCookie("access_token")
            }
        })
            .then(response => response.blob())
            .then(data => {
                //const file = download(data, 'pdf', 'application/pdf');

                //Create a Blob from the PDF Stream
                const file = new Blob([data], {
                    type: "application/pdf"
                });

                setPdf(file);
                /*
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL);
                */
            })
            .catch(error => console.error(error));
    }, [])

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
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => download(pdf, 'Información pública de Sociedad Anónima', 'application/pdf')}
                                >
                                    Descargar
                                </Button>
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