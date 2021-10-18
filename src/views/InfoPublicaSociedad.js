import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';

export function InfoPublicaSociedad(props) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    useEffect(() => {
        let ruta = 'api/sa/';

        fetch(env("BACKEND_URL") + ruta, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + getCookie("access_token")
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error(error));
    }, [])

    return (
        <div>
            <Document
                file="somefile.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
        </div>
    );

}