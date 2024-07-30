import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './QrCode.module.css';

const QrCode = () => {
    const [qrCode, setQrCode] = useState(null);
    const navigate = useNavigate();
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

    const handleButtonClick = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <>
            <div className={styles.container}>
                {qrCode ? (
                    <img className={styles.image} src={qrCode} alt="QR Code" />
                ) : (
                    <p className={styles.loading}>Loading QR code...</p>
                )}
            </div>
            <div className={styles.container2}>
                <button className={styles.button} onClick={handleButtonClick}>뒤로가기</button>
            </div>
        </>
    );
};

export default QrCode;