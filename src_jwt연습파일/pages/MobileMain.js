
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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

            const processData = qrData.split('\n').map((item, index) => {
                const dataObject = {};
                const keyValuePairs = item.match(/(\w+)=([^,]+)/g);
                if (keyValuePairs) {
                    keyValuePairs.forEach(pair => {
                        const [key, value] = pair.split("=");
                        if (key && value) {
                            dataObject[key.trim()] = value.trim();
                        }
                    });
                    console.log(`Parsed item ${index}:`, dataObject);
                    return { ...dataObject, isChecked: false };
                }
                console.log(`Failed to parse item ${index}:`, item);
                return null;
            }).filter(Boolean);

            console.log('Processed Data:', processData);
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
        const itemsToUpdate = qrCodesData
            .filter(item => item.isChecked && item.movstatus === "대기")
            .map(item => ({ movidx: item.movidx.toString(), newStatus: "완료" }));

        try {
            const response = await axios.post('http://10.10.10.207:8090/traders/api/updateMovStatus', itemsToUpdate);
            if (response.status === 200) {
                setQrCodesData(prevData =>
                    prevData.map(item =>
                        itemsToUpdate.some(updatedItem => updatedItem.movidx === item.movidx)
                            ? { ...item, movstatus: "완료", isChecked: false }
                            : item
                    )
                );
                alert('검수완료되었습니다.');

            } else {
                alert(`검수완료 처리 중 오류가 발생했습니다: ${response.data}`);
            }
        } catch (error) {
            console.error('Error updating movement statuses', error);
            alert(`검수완료 처리 중 오류가 발생했습니다: ${error.response ? error.response.data : error.message}`);
        }
    };


    const handleRowClick = (gcode) => {
        navigate(`/mobile/productDetail/${gcode}`);
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
                            >
                                <thead>
                                    <tr>
                                        <th colSpan="2">QR 코드 정보</th>
                                        <th>확인</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>입고날짜</th>
                                        <td>{item.movdate || ''}</td>
                                        <td rowSpan="7" className={mobileMain.checkbox_cell}>
                                            <input
                                                type="checkbox"
                                                checked={item.isChecked || false}
                                                onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                                                onChange={() => handleCheckboxChange(idx)}
                                                disabled={item.movstatus === '완료'}
                                            />
                                        </td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>입고코드</th>
                                        <td>{item.movcode || ''}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>발주코드</th>
                                        <td>{item.ordercode || ''}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>지점아이디</th>
                                        <td>{item.branchid || ''}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>상품코드</th>
                                        <td>{item.gcode || ''}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>입고수량</th>
                                        <td>{item.movquantity || ''}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
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