import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './QrCode.module.css';

const QrCode = () => {
    const [qrCode, setQrCode] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date");
    const [qrData, setQrData] = useState('');

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const response = await axios.get(`http://10.10.10.207:8090/traders/api/qrcode?date=${date}`, {
                    responseType: 'arraybuffer',
                });
                const base64Image = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setQrCode(`data:image/png;base64,${base64Image}`);

                setQrData(response.data);
                console.log(qrData);
                console.log(qrCode);

            } catch (error) {
                console.error('Error fetching QR code:', error);
            }
        };

        fetchQrCode();
    }, [date]);

    return (
        <div className={styles.rable}>
            <div className={styles.warn}>
                <h3>아이폰은 네이버앱으로 QR코드 인식 부탁드립니다.</h3>
            </div>
            <div className={styles.container}>
                {qrCode ? (
                    <img className={styles.image} src={qrCode} alt="QR Code" />
                ) : (
                    <p className={styles.loading}>Loading QR code...</p>
                )}
            </div>
            <div className={styles.container2}>
                <button className={styles.button} onClick={() => navigate(-1)}>뒤로가기</button>
            </div>
        </div>
    );
};

export default QrCode;