import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './QrCode.module.css';
// import api from '../util/api';
import axios from 'axios';

const QrCode = () => {
    const [qrCode, setQrCode] = useState(null); // QR 코드 이미지의 Base64 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date"); // URL에서 날짜를 가져옴
    const branchId = localStorage.getItem("branchId");


    console.log(date);


    useEffect(() => {

        const fetchQrCode = async () => {

            try {
                // const response = await axios.get(`http://10.10.10.153:8090/traders/api/${branchId}/qrcode?date=${date}`, {
                const response = await axios.get(`http://10.10.10.109:8090/traders/api/${branchId}/qrcode?date=${date}`, {

                    responseType: 'arraybuffer', // 응답을 바이너리 데이터로 받음
                });

                const base64Image = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setQrCode(`data:image/png;base64,${base64Image}`); // Base64 인코딩된 이미지를 상태로 설정
                setLoading(false); // 로딩 완료
            } catch (error) {
                console.error('Error fetching QR code:', error);
                setError('QR 코드를 불러오는 중 오류가 발생했습니다.');
                setLoading(false); // 로딩 완료
            }
        };

        fetchQrCode();
    }, [branchId, date, navigate]);

    if (loading) {
        return <p className={styles.loading}>QR 코드를 불러오는 중입니다...</p>; // 로딩 중 메시지 표시
    }

    if (error) {
        return <p className={styles.error}>{error}</p>; // 에러 메시지 표시
    }

    return (
        <div className={styles.rable}>
            <div className={styles.warn}>
                <h3>아이폰은 네이버앱으로 QR코드 인식 부탁드립니다.</h3>
            </div>
            <div className={styles.container}>
                {qrCode ? (
                    <img className={styles.image} src={qrCode} alt="QR Code" /> // QR 코드 이미지 표시
                ) : (
                    <p className={styles.loading}>QR 코드를 불러올 수 없습니다.</p>
                )}
            </div>
            <div className={styles.container2}>
                <button className={styles.button} onClick={() => navigate(-1)}>뒤로가기</button> {/* 뒤로가기 버튼 */}
            </div>
        </div>
    );
};

export default QrCode;
