import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // HTTP 요청을 위한 axios import

import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios'; // axios import

import logo from '../assets/logo.png';
import mobileMain from './MobileMain2.module.css'; // 스타일링을 위한 CSS 모듈

const MobileMain = () => {
    // QR 코드 데이터를 저장하기 위한 상태
    const [qrCodesData, setQrCodesData] = useState([]);
    // 에러 메시지를 처리하기 위한 상태
    const [error, setError] = useState(null);
    // '전체 선택' 체크박스 상태를 처리하기 위한 상태
    const [selectAll, setSelectAll] = useState(false);
    // 프로그램적으로 네비게이션을 위한 hook
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const qrData = searchParams.get('data');

    // 컴포넌트가 마운트될 때 QR 코드 데이터를 가져오는 비동기 작업
    useEffect(() => {
        // <<<<<<< HEAD
        //         const fetchQrCodes = async () => {
        //             try {
        //                 // QR 코드 데이터를 가져오기 위한 GET 요청
        //                 const response = await axios.get("http://localhost:8090/traders/api/qrcodeDivisions");
        //                 const data = response.data;
        //                 console.log('QR 코드 데이터:', data);

        //                 // 데이터 형식에 따라 처리
        //                 const parsedData = Array.isArray(data) ? data : Object.values(data);

        //                 // 원시 텍스트 데이터를 포맷팅
        //                 const formattedData = parsedData.flatMap(item => {
        //                     const matches = item.text.match(/\(([^)]+)\)/g);
        //                     if (matches) {
        //                         return matches.map(match => {
        //                             const keyValuePairs = match.replace(/[()]/g, "").split(", ");
        //                             const dataObject = {};
        //                             keyValuePairs.forEach(pair => {
        //                                 const [key, value] = pair.split("=");
        //                                 if (key && value) {
        //                                     dataObject[key.trim()] = value.trim();
        //                                 }
        //                             });
        //                             return { ...dataObject, isChecked: false };
        //                         });
        //                     }
        //                     return [];
        //                 });

        //                 // 포맷팅된 데이터를 상태에 저장
        //                 setQrCodesData(formattedData);

        //             } catch (error) {
        //                 // 데이터 가져오기 실패 시 에러 처리
        //                 console.error("QR 코드 가져오기 에러:", error);
        //                 setError("QR 코드를 가져오는 데 문제가 발생했습니다. 서버가 실행 중인지 확인해 주세요.");
        //             }
        //         };

        //         fetchQrCodes(); // 데이터를 가져오는 함수 호출
        //     }, []);
        // =======
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

    // '전체 선택' 체크박스 상태를 토글하고 모든 항목의 체크 상태를 업데이트
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setQrCodesData(prevData =>
            prevData.map(item => ({ ...item, isChecked: !selectAll }))
        );
    };

    // 개별 체크박스의 체크 상태를 토글
    const handleCheckboxChange = (index) => {
        setQrCodesData(prevData =>
            prevData.map((item, idx) =>
                idx === index ? { ...item, isChecked: !item.isChecked } : item
            )
        );
    };

    // 선택된 항목의 상태를 업데이트하고 서버에 POST 요청을 보내는 함수
    const handleSubmit = async () => {
        // 체크된 항목 중 '대기' 상태인 항목 필터링
        const selectedItems = qrCodesData.filter(item => item.isChecked && item.movstatus === '대기');
        try {
            // 상태 업데이트를 위한 POST 요청
            const response = await axios.post('http://localhost:8090/traders/api/updateStatuses', selectedItems, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const updatedData = response.data;
            // 서버 응답 데이터로 상태 업데이트
            setQrCodesData(prevData => prevData.map(item => {
                if (item.isChecked && item.movstatus === '대기') {
                    const updatedItem = updatedData.find(uItem => uItem.id === item.id);
                    return updatedItem ? { ...updatedItem, isChecked: item.isChecked } : item;
                }
                return item;
            }));

        } catch (error) {
            // 상태 업데이트 실패 시 에러 처리
            console.error('업데이트 에러:', error);
            setError("상태 업데이트 중 문제가 발생했습니다. 서버가 실행 중인지 확인해 주세요.");
        }
    };

    // 항목 클릭 시 제품 상세 페이지로 이동
    const handleRowClick = (gcode) => {
        navigate(`/mobile/productDetail/${gcode}`); // 클릭 시 gcode를 기반으로 페이지 이동
        console.log(gcode);
    };

    // 에러가 있을 경우 에러 메시지 표시
    if (error) {
        return <div>에러: {error}</div>;
    }

    // '완료' 또는 '대기' 상태인 항목만 필터링
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
                                                disabled={item.movstatus === '완료'} // 상태가 '완료'일 때 체크박스 비활성화
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
