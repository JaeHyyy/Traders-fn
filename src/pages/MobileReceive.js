import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import mobileReceive from './MobileReceive.module.css';
import { getAuthToken } from "../util/auth";

const MobileReceive = () => {
    const [qrCodesData, setQrCodesData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목을 저장할 상태 추가
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date');
    const loc1 = searchParams.get('loc1');    // URL에서 loc1 가져오기
    const loc2 = searchParams.get('loc2');    // URL에서 loc2 가져오기
    const loc3 = searchParams.get('loc3');    // URL에서 loc3 가져오기
    const price = searchParams.get('price');  // URL에서 price 가져오기
    const branchName = localStorage.getItem('branchName');
    const token = getAuthToken();

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

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://TradersApp5.us-east-2.elasticbeanstalk.com/traders/movement/${branchId}/${date}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                let fetchedData = response.data;

                fetchedData = fetchedData.map(item => {
                    if (item.movstatus === '출고 완료') {
                        return {
                            ...item,
                            movstatus: '입고 대기'
                        };
                    }
                    return item;
                });

                setQrCodesData(fetchedData);
                console.log("data: ", fetchedData);
            } catch (error) {
                console.error('서버에서 데이터를 가져오는 중 오류 발생', error);
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
            }
        };

        fetchData();
    }, [branchId, date, navigate, token]);

    const handleRowClick = (gcode) => {
        navigate(`/mobile/productDetail/${gcode}?branchId=${branchId}&date=${date}`);
    };

    const handleCheckboxChange = (gcode) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(gcode)) {
                // gcode가 이미 선택된 경우, 선택을 해제합니다
                return [];
            } else {
                // 그렇지 않으면, 현재 항목을 선택하고 다른 선택된 항목은 해제합니다
                return [gcode];
            }
        });
    };

    const handleCompleteInspection = async () => {
        if (selectedItems.length === 0) {
            alert("검수할 항목을 선택하세요.");
            return;
        }

        try {
            const itemsToUpdate = qrCodesData
                .filter(item => selectedItems.includes(item.gcode))
                .map(item => {
                    return {
                        branchid: item.branchid,
                        gcode: item.gcode,  // 개별 항목의 gcode를 사용
                        movdate: item.movdate,
                        newStatus: "입고 완료",
                        movquantity: item.movquantity,
                        loc1: loc1 || item.loc1,  // URL에서 가져온 loc1 또는 항목의 loc1 사용
                        loc2: loc2 || item.loc2,  // URL에서 가져온 loc2 또는 항목의 loc2 사용
                        loc3: loc3 || item.loc3,  // URL에서 가져온 loc3 또는 항목의 loc3 사용
                        gprice: price || item.gprice  // URL에서 가져온 가격 또는 항목의 가격 사용
                    };
                });

            console.log("업데이트할 항목들:", itemsToUpdate);

            const response = await axios.post(
                'http://TradersApp5.us-east-2.elasticbeanstalk.com/traders/movement/updateMovStatus',
                itemsToUpdate,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("상태 업데이트 완료:", response.data);

            // UI 갱신
            setQrCodesData(prevData =>
                prevData.map(item =>
                    selectedItems.includes(item.gcode)
                        ? { ...item, movstatus: "입고 완료" }
                        : item
                )
            );

            setSelectedItems([]); // 선택된 항목 초기화
            alert("검수가 완료되었습니다.");
        } catch (error) {
            console.error("상태 업데이트 오류:", error);
            setError('검수 완료 중 오류가 발생했습니다.');
            alert("검수 완료 중 오류가 발생했습니다.");
        }
    };

    const handleReject = async () => {
        if (selectedItems.length === 0) {
            alert("반려할 항목을 선택하세요.");
            return;
        }

        try {
            const itemsToReject = qrCodesData
                .filter(item => selectedItems.includes(item.gcode))
                .map(item => {
                    return {
                        branchid: item.branchid,
                        gcode: item.gcode,
                        movdate: item.movdate,
                        newStatus: "반려",  // 반려 상태로 업데이트
                        movquantity: item.movquantity,
                        loc1: loc1 || item.loc1,
                        loc2: loc2 || item.loc2,
                        loc3: loc3 || item.loc3,
                        gprice: price || item.gprice
                    };
                });

            console.log("반려할 항목들:", itemsToReject);

            const response = await axios.post(
                'http://TradersApp5.us-east-2.elasticbeanstalk.com/traders/movement/updateMovStatus',
                itemsToReject,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("반려 상태 업데이트 완료:", response.data);

            // UI 갱신
            setQrCodesData(prevData =>
                prevData.map(item =>
                    selectedItems.includes(item.gcode)
                        ? { ...item, movstatus: "반려" }
                        : item
                )
            );

            setSelectedItems([]); // 선택된 항목 초기화
            alert("반려가 완료되었습니다.");
        } catch (error) {
            console.error("반려 상태 업데이트 오류:", error);
            setError('반려 처리 중 오류가 발생했습니다.');
            alert("반려 처리 중 오류가 발생했습니다.");
        }
    };

    if (error) {
        return <div>에러: {error}</div>;
    }

    // "입고 완료" 또는 "반려" 상태가 아닌 항목들만 필터링합니다
    const filteredQrCodesData = qrCodesData.filter(
        item => item.movstatus !== '입고 완료' && item.movstatus !== '반려'
    );

    return (
        <div className={mobileReceive.mainMobile_page}>
            <div className={mobileReceive.mainMobile_box}>
                <img
                    src={logo}
                    alt="로고"
                    className={mobileReceive.logo}
                    onClick={() => navigate(`/mobile/main?branchId=${branchId}&date=${date}`)}
                />

                <div className={mobileReceive.card_box}>
                    <div className={mobileReceive.card_title}>
                        <div className={mobileReceive.flexContainer}>
                            <h6>입고내역서 - {branchName}</h6>
                        </div>
                    </div>
                    <div className={mobileReceive.card_content}>
                        {filteredQrCodesData.length > 0 ? filteredQrCodesData
                            .map((item, idx) => (
                                item.gcode ? (
                                    <table
                                        key={idx}
                                        className={`${mobileReceive.table_container}`}>
                                        <thead>
                                            <tr>
                                                <th colSpan="2">
                                                    <div className={mobileReceive.flexContainer}>
                                                        <span>입고 품목</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(item.gcode)}
                                                            onChange={() => handleCheckboxChange(item.gcode)}
                                                            className={mobileReceive.checkbox}
                                                        />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr onClick={() => handleRowClick(item.gcode)}>
                                                <th>입고날짜</th>
                                                <td>{item.movdate}</td>
                                            </tr>
                                            <tr onClick={() => handleRowClick(item.gcode)}>
                                                <th>발주코드</th>
                                                <td>{item.ordercode}</td>
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
                                ) : null
                            )) : <p className={mobileReceive.load}>금일 입고된 상품이 없습니다.</p>}
                    </div>
                    <button
                        className={mobileReceive.complete_button}
                        onClick={handleCompleteInspection}>검수 완료
                    </button>
                    <button
                        className={mobileReceive.reject_button}
                        onClick={handleReject}>반려하기
                    </button>

                </div>
            </div>
        </div>
    );

};

export default MobileReceive;
