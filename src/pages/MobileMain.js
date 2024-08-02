import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // axios import
import logo from '../assets/logo.png';
import mobileMain from './MobileMain2.module.css';

const MobileMain = () => {
    const [qrCodesData, setQrCodesData] = useState([]);
    const [error, setError] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const qrData = searchParams.get('data');

    useEffect(() => {
        if (qrData) {
            console.log('Received QR Data:', qrData);

            // qrData를 사용하여 필요한 작업 수행 (예: 필터링, 추가 처리 등)
            const processData = qrData.split('\n').map(item => {
                const dataObject = {};
                const keyValuePairs = item.match(/(\w+)=([^,]+)/g);
                if (keyValuePairs) {
                    keyValuePairs.forEach(pair => {
                        const [key, value] = pair.split("=");
                        if (key && value) {
                            dataObject[key.trim()] = value.trim();
                        }
                    });
                    return { ...dataObject, isChecked: false };
                }
                return null;
            }).filter(Boolean);

            setQrCodesData(processData);

        }
    }, [qrData]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setQrCodesData(prevData =>
            prevData.map(item => ({ ...item, isChecked: !selectAll }))
        );
    };

    const handleCheckboxChange = (index) => {
        setQrCodesData(prevData =>
            prevData.map((item, idx) =>
                idx === index ? { ...item, isChecked: !item.isChecked } : item
            )
        );
    };

    const handleSubmit = async () => {
        const selectedItems = qrCodesData.filter(item => item.isChecked && item.movstatus === '대기');
        try {
            const response = await axios.post('http://localhost:8090/traders/api/updateStatuses', selectedItems, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const updatedData = response.data;
            setQrCodesData(prevData => prevData.map(item => {
                if (item.isChecked && item.movstatus === '대기') {
                    const updatedItem = updatedData.find(uItem => uItem.id === item.id);
                    return updatedItem ? { ...updatedItem, isChecked: item.isChecked } : item;
                }
                return item;
            }));

        } catch (error) {
            console.error('업데이트 에러:', error);
            setError("상태 업데이트 중 문제가 발생했습니다. 서버가 실행 중인지 확인해 주세요.");
        }
    };

    const handleRowClick = (gcode) => {
        navigate(`/mobile/productDetail/${gcode}`); // 클릭 시 gcode를 기반으로 페이지 이동
        console.log(gcode);
    };

    if (error) {
        return <div>에러: {error}</div>;
    }

    const filteredQrCodesData = qrCodesData.filter(item => item.movstatus === "완료" || item.movstatus === "대기");

    return (
        <div className={mobileMain.mainMobile_page}>
            <div className={mobileMain.mainMobile_box}>
                <img src={logo} alt="로고" className={mobileMain.logo} />
                <div className={mobileMain.card_box}>
                    <div className={mobileMain.card_title}>
                        <h6>입고내역서</h6>
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </div>
                    <div className={mobileMain.card_content}>
                        {filteredQrCodesData.length > 0 ? filteredQrCodesData.map((item, idx) => (
                            <table
                                key={idx}
                                className={`${mobileMain.table_container} ${item.movstatus === '완료' ? mobileMain.completed : ''}`}
                                onClick={() => handleRowClick(item.gcode)} // 클릭 시 gcode를 기반으로 페이지 이동
                            >
                                <thead>
                                    <tr>
                                        <th colSpan="2">QR 코드 정보</th>
                                        <th>확인</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>입고날짜</th>
                                        <td>{item.movdate || ''}</td>
                                        <td rowSpan="7" className={mobileMain.checkbox_cell}>
                                            <input
                                                type="checkbox"
                                                checked={item.isChecked || false}
                                                onChange={() => handleCheckboxChange(idx)}
                                                disabled={item.movstatus === '완료'}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>입고코드</th>
                                        <td>{item.movcode || ''}</td>
                                    </tr>
                                    <tr>
                                        <th>발주코드</th>
                                        <td>{item.ordercode || ''}</td>
                                    </tr>
                                    <tr>
                                        <th>지점아이디</th>
                                        <td>{item.branchid || ''}</td>
                                    </tr>
                                    <tr>
                                        <th>상품코드</th>
                                        <td>{item.gcode || ''}</td>
                                    </tr>
                                    <tr>
                                        <th>입고수량</th>
                                        <td>{item.movquantity || ''}</td>
                                    </tr>
                                    <tr>
                                        <th>입고상태</th>
                                        <td>{item.movstatus || ''}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )) : <p>로딩 중...</p>}
                    </div>
                    <div className={mobileMain.mobileLogin}>
                        <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} onClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMain;
