import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import mobileMain from './MobileMain2.module.css';
import { getAuthToken } from "../util/auth";

const MobileMain = () => {
    const [qrCodesData, setQrCodesData] = useState([]);
    const [error, setError] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date'); // URL에서 date 값을 가져옴
    const branchName = localStorage.getItem('branchName');
    const token = getAuthToken(); // Retrieve the token

    useEffect(() => {
        if (!branchId || !date) {
            console.error('Branch ID 또는 날짜가 없습니다. 로그인 정보를 확인해주세요.');
            alert("로그인을 먼저해주세요.");
            navigate(`mobile/login?date=${date}`);
            return;
        }

        console.log("branchId: ", branchId);
        console.log("date: ", date);
        console.log("token: ", token);

        // 서버에서 데이터를 가져오는 부분
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://10.10.10.153:8090/traders/movement/${branchId}/${date}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Include the token in the header
                        }
                    }
                );

                let fetchedData = response.data;

                // 데이터를 순회하면서 필요한 대로 movstatus를 수정합니다.
                fetchedData = fetchedData.map(item => {
                    if (item.movstatus === '출고 완료') { // 이 조건은 필요에 따라 조정할 수 있습니다.
                        return {
                            ...item,
                            movstatus: '입고 대기' // 상태를 적절하게 변경합니다.
                        };
                    }
                    return item;
                });

                setQrCodesData(fetchedData);
                console.log("data: ", fetchedData);
            } catch (error) {
                console.error('Error fetching data from server', error);
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
            }
        };

        fetchData();
    }, [branchId, date, navigate, token]);


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
            const response = await axios.post(
                'http://10.10.10.153:8090/traders/api/updateMovStatus',
                itemsToUpdate,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the header
                    }
                }
            );
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
        navigate(`/mobile/productDetail/${gcode}?date=${date}`);
    };

    if (error) {
        return <div>에러: {error}</div>;
    }

    return (
        <div className={mobileMain.mainMobile_page}>
            <div className={mobileMain.mainMobile_box}>
                <img src={logo} alt="로고" className={mobileMain.logo} />
                <div className={mobileMain.card_box}>
                    <div className={mobileMain.card_title}>
                        <h6>입고내역서 - {branchName}</h6>
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </div>
                    <div className={mobileMain.card_content}>
                        {qrCodesData.length > 0 ? qrCodesData.map((item, idx) => (
                            <table
                                key={idx}
                                className={`${mobileMain.table_container} ${item.movstatus === '완료' ? mobileMain.completed : ''}`}>
                                <thead>
                                    <tr>
                                        <th colSpan="2">QR 코드 정보</th>
                                        <th>확인</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>입고날짜</th>
                                        <td>{item.movdate}</td>
                                        <td rowSpan="7" className={mobileMain.checkbox_cell}>
                                            <input
                                                type="checkbox"
                                                checked={item.isChecked || false}
                                                onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                                                onChange={() => handleCheckboxChange(idx)}
                                                disabled={item.movstatus === '입고 완료'}
                                            />
                                        </td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>발주코드</th>
                                        <td>{item.ordercode}</td> {/* ordercode 사용 */}
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>지점아이디</th>
                                        <td>{item.branchid}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>상품코드</th>
                                        <td>{item.gcode}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>입고수량</th>
                                        <td>{item.movquantity}</td>
                                    </tr>
                                    <tr onClick={() => handleRowClick(item.gcode)}>
                                        <th>입고상태</th>
                                        <td>{item.movstatus}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )) : <p className={mobileMain.load}>금일 입고된 상품이 없습니다.</p>}
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
