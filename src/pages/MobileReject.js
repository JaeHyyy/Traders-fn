import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mobileReject from './MobileReject.module.css';
import logo from '../assets/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';

// 반려상태인 데이터만 조회
const MobileReject = () => {
    const branchName = localStorage.getItem('branchName'); // branchName 가져오기
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date');
    const [rejectedItems, setRejectedItems] = useState([]); // 반려된 데이터 저장

    useEffect(() => {
        // 서버에서 반려된 항목 데이터 가져오기
        const fetchRejectedItems = async () => {
            try {
                const branchId = localStorage.getItem('branchId'); // branchId를 localStorage에서 가져오기
                const response = await axios.get(`http://10.10.10.109:8090/traders/movement/rejected/${branchId}`);
                const data = response.data;

                // 필요한 필드들만 추출하여 상태에 저장
                const filteredData = data.map(item => ({
                    movidx: item.movidx,
                    branchid: item.branchid,
                    gcode: item.gcode,
                    movdate: item.movdate,
                    movquantity: item.movquantity,
                    movstatus: item.movstatus,
                    ordercode: item.ordercode
                }));

                setRejectedItems(filteredData);
            } catch (error) {
                console.error('Error fetching rejected items:', error);
            }
        };

        fetchRejectedItems();
    }, []);

    return (
        <div className={mobileReject.mobileReject_page}>
            <img
                src={logo}
                alt="로고"
                className={mobileReject.logo}
                onClick={() => navigate(`/mobile/main?branchId=${branchId}&date=${date}`)}
            />
            <div className={mobileReject.mobileReject_content}>
                <div className={mobileReject.title}>
                    <span>반려상품목록</span>
                    <span className={mobileReject.branchName}> - {branchName}</span>
                </div>
                <div className={mobileReject.card_section}>
                    {rejectedItems.length > 0 ? (
                        rejectedItems.map((item, index) => (
                            <div key={index} className={mobileReject.card}>
                                <p>상품번호: {item.movidx}</p>
                                <p>상품코드: {item.gcode}</p>
                                <p>반려 날짜: {item.movdate}</p>
                                <p>수량: {item.movquantity}</p>
                                <p>상태: {item.movstatus}</p>
                                <p>지점명: {item.branchid}</p>
                                <p>주문번호: {item.ordercode}</p>
                            </div>
                        ))
                    ) : (
                        <p>반려된 상품이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MobileReject;
