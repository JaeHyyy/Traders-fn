import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './QrCode.module.css';

const QrCode = () => {
    const [qrCode, setQrCode] = useState(null);
    const navigate = useNavigate();

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

    function handleButtonClick() {
        return navigate('/receipt');
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