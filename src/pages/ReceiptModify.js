import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../util/api';
import styles from './ReceiptModify.module.css';
import get from 'lodash/get';
import ReactToPrint from 'react-to-print';
import { InputText } from 'primereact/inputtext';



const ReceiptModify = () => {
    const [movements, setMovements] = useState([]);
    const [qrCode, setQrCode] = useState(null);
    const [manager, setManager] = useState('');
    const [searchParams] = useSearchParams();
    const movdate = searchParams.get("movdate");
    const navigate = useNavigate();
    const branchName = localStorage.getItem('branchName');
    const ref = useRef();

    const columns = [
        { header: '순번', accessor: null, className: styles['column-seq'] },
        { header: '상품코드', accessor: 'goods.gcode', className: styles['column-gcode'] },
        { header: '상품명', accessor: 'goods.gname', className: styles['column-gname'] },
        { header: '제조사', accessor: 'goods.gcompany', className: styles['column-gcompany'] },
        { header: '수량', accessor: 'movement.movquantity', className: styles['column-movquantity'] },
        { header: '단위', accessor: 'goods.gunit', className: styles['column-gunit'] },
        { header: '총액', accessor: 'goods.gcostprice', className: styles['column-gcostprice'] },
        { header: '검수상태', accessor: 'movement.movstatus', className: styles['column-movstatus'] },
    ];

    useEffect(() => {
        const branchId = localStorage.getItem("branchId");
        if (!branchId) {
            console.error('Branch ID가 없습니다. 로그인 정보를 확인해주세요.');
            navigate('/login');
            return;
        }

        //입고상세내역
        api.get(`/traders/${branchId}/join?movdate=${movdate}`)
            .then(response => {
                console.log('API Response:', response.data);
                setMovements(response.data);
                console.log("받아온 데이터 : ", branchName)

            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            });

        // QR 코드 가져오기
        api.get(`/traders/api/${branchId}/qrcode?date=${movdate}`, {
            responseType: 'arraybuffer',
        })
            .then(response => {
                const base64Image = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setQrCode(`data:image/png;base64,${base64Image}`);
            })
            .catch(error => {
                console.error('Error fetching QR code:', error);
            });

    }, [movdate, navigate]);

    return (
        <div className={styles.rable}>
            <div className={styles["table-container"]}>
                <div className={styles.printButtonContainer}>
                    <div className={styles.managerInputContainer}>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText
                                value={manager}
                                onChange={(e) => setManager(e.target.value)}
                                placeholder="담당자"
                            />
                        </div>
                    </div>
                    <ReactToPrint
                        trigger={() => (
                            <button className={styles.printButton}>PDF 저장/인쇄</button>
                        )}
                        content={() => ref.current}
                    />
                </div>
                <div ref={ref} className={styles.print}>
                    <div className={styles.info}>
                        <div className={styles.bracnh}>
                            <br />
                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}> {branchName} / {manager}</p><br />
                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}> 입고날짜 : {movdate} </p><br />
                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}> 입고 번호: {movements[0]?.movement?.ordercode || 'N/A'}</p>
                        </div>
                        <div className={styles.qr}>
                            {qrCode ? (
                                <img src={qrCode} alt="QR Code" className={styles.qrImage} />
                            ) : (
                                <span>Loading QR code...</span>
                            )}
                        </div>
                    </div>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index}>{column.header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex}>
                                            {column.accessor ? (
                                                column.accessor === 'movement.movstatus' && get(row, column.accessor) === '출고 완료' ? (
                                                    '입고 대기'
                                                ) : column.accessor === 'goods.gcostprice' ? (
                                                    (get(row, 'goods.gcostprice') * get(row, 'movement.movquantity')).toLocaleString('ko-KR')
                                                ) : (
                                                    get(row, column.accessor)
                                                )
                                            ) : (
                                                rowIndex + 1
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModify;