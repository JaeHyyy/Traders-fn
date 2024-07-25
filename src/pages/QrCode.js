import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QrCode = () => {
    const [qrCode, setQrCode] = useState(null);

    useEffect(() => {
        const fetchQrCode = async () => {
            try { //ssg wifi ip : 10.10.10.197
                const response = await axios.get('http://localhost:8090/traders/api/qrcode', {
                    responseType: 'arraybuffer',
                });
                const base64Image = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setQrCode(`data:image/png;base64,${base64Image}`);
            } catch (error) {
                console.error('Error fetching QR code:', error);
            }
        };

        fetchQrCode();
    }, []);

    return (
        <div>
            <h1>QR Code</h1>
            {qrCode ? (
                <img src={qrCode} alt="QR Code" />
            ) : (
                <p>Loading QR code...</p>
            )}
        </div>
    );
};

export default QrCode;