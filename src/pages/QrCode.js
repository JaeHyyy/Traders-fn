import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Styles from 'QrCode.module.css';

const QrCode = () => {
    const [qrCode, setQrCode] = useState(null);
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date")
    console.log(date);
    //const date = "2024-07-19";
    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/traders/api/qrcode?date=${date}`, {
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
        <div className="style.container">
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