import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import A_1 from '../assets/AA-A.png';
import A_2 from '../assets/AA-B.png';
import A_3 from '../assets/AA-C.png';
import B from '../assets/BB-A,B,C.png';
import C from '../assets/CC-A,B,C.png';
import plan from '../assets/baseProductLocation.png';
import product from './MobileProductDetail3.module.css';

// 구역별 이미지 객체
const ZONE_IMAGES = {
    A: {
        'AA-A': A_1,
        'AA-B': A_2,
        'AA-C': A_3
    },
    B: B,
    C: C
};

const loc1Options = ['AA', 'BB', 'CC'];
const loc2Options = ['A', 'B', 'C'];
const loc3Options = ['a', 'b', 'c', 'd', 'e', 'f'];

const MobileProductDetail = () => {
    const { gcode } = useParams();  // URL에서 gcode 파라미터를 가져옵니다.
    const [productDetails, setProductDetails] = useState(null);  // 제품 상세 정보 상태
    const [additionalInfo, setAdditionalInfo] = useState(null);  // 추가 정보 상태
    const [movementDetails, setMovementDetails] = useState(null);  // movement 데이터 상태
    const [error, setError] = useState(null);  // 오류 상태
    const [zoneImage, setZoneImage] = useState(null);  // 구역별 이미지 상태
    const [newLoc1, setNewLoc1] = useState('');  // 새로운 loc1 상태
    const [newLoc2, setNewLoc2] = useState('');  // 새로운 loc2 상태
    const [newLoc3, setNewLoc3] = useState('');  // 새로운 loc3 상태

    // gcode를 사용하여 제품 상세 정보와 추가 정보를 가져오는 함수
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                console.log(`gcode ${gcode}에 대한 제품 상세 정보 가져오기`);

                // 제품 상세 정보와 추가 정보를 동시에 가져오기
                // ssg wifi : 10.10.10.197
                const [response1, response2, response3] = await Promise.all([
                    axios.get(`http://10.10.10.207:8090/traders/stock/gcode-data/${gcode}`),
                    // axios.get(`http://192.168.0.109:8090/traders/stock/gcode-data/${gcode}`),

                    axios.get(`http://10.10.10.207:8090/traders/goods/${gcode}`),
                    // axios.get(`http://192.168.0.109:8090/traders/goods/${gcode}`),

                    axios.get(`http://10.10.10.207:8090/traders/movement/${gcode}`)
                    // axios.get(`http://192.168.0.109:8090/traders/movement/${gcode}`)

                ]);

                const data1 = response1.data[0];  // 배열의 첫 번째 요소를 사용
                const data2 = response2.data;
                const data3 = response3.data[0]; // 배열의 첫 번째 요소를 사용

                // response1 데이터 설정
                if (data1) {
                    console.log('stock + goods:', data1);
                    setProductDetails(data1);  // 제품 상세 정보 설정
                } else {
                    console.log('stock 데이터가 없습니다');
                    setProductDetails(null);  // 데이터가 없으면 null 설정
                }

                // response2 데이터 설정
                if (data2) {
                    console.log("goods:", data2);
                    setAdditionalInfo(data2);  // 추가 정보 설정
                } else {
                    console.log('goods 데이터가 없습니다.');
                    setAdditionalInfo(null);
                }

                // response3 데이터 설정
                if (data3) {
                    console.log("movement:", data3);
                    setMovementDetails(data3);  // movement 데이터 설정
                } else {
                    console.log('movement 데이터가 없습니다.');
                }

            } catch (error) {
                console.error("제품 상세 정보 가져오기 오류:", error);
                if (error.response) {
                    setError(`서버 오류: ${error.response.status} ${error.response.statusText}`);
                } else if (error.request) {
                    setError("서버로부터 응답을 받지 못했습니다.");
                } else {
                    setError("요청을 설정하는 중 오류가 발생했습니다.");
                }
                setProductDetails(null);  // 오류 발생 시 null 설정
                setAdditionalInfo(null);
                setMovementDetails(null);
            }
        };

        fetchProductDetails();
    }, [gcode]);

    // 구역 이미지 결정 함수
    useEffect(() => {
        if (productDetails) {
            const { loc1, loc2 } = productDetails;

            let imageUrl = null;

            // loc1과 loc2를 조합하여 구역별 이미지 결정
            if (loc1.startsWith('AA')) {
                imageUrl = ZONE_IMAGES.A[`${loc1}-${loc2}`] || ZONE_IMAGES.A[loc1] || null;
            } else if (loc1.startsWith('BB')) {
                imageUrl = ZONE_IMAGES.B;
            } else if (loc1.startsWith('CC')) {
                imageUrl = ZONE_IMAGES.C;
            }

            setZoneImage(imageUrl);
        }
    }, [productDetails]);

    // 위치 정보를 업데이트하는 함수
    const updateLocation = async () => {
        try {
            const updatedLocation = {
                loc1: newLoc1,
                loc2: newLoc2,
                loc3: newLoc3
            };

            // API 요청을 통해 위치 업데이트
            const response = await axios.put('http://10.10.10.207:8090/traders/stock/mobile-update-location', null, {
                // const response = await axios.put('http://192.168.0.109:8090/traders/stock/mobile-update-location', null, {

                params: {
                    gcode,
                    loc1: updatedLocation.loc1,
                    loc2: updatedLocation.loc2,
                    loc3: updatedLocation.loc3
                }
            });
            console.log('위치 정보 업데이트 완료:', response.data);

            // 업데이트된 위치 정보를 상태에 반영
            setProductDetails((prevDetails) => ({
                ...prevDetails,
                loc1: updatedLocation.loc1,
                loc2: updatedLocation.loc2,
                loc3: updatedLocation.loc3
            }));
        } catch (error) {
            console.error("위치 정보 업데이트 오류:", error);
            if (error.response) {
                setError(`서버 오류: ${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                setError("서버로부터 응답을 받지 못했습니다.");
            } else {
                setError("요청을 설정하는 중 오류가 발생했습니다.");
            }
        }
    };

    // 데이터가 없는 경우 기본값 설정
    const details = {
        gcode: gcode,
        goodsData: {
            gname: productDetails?.goodsData?.gname || additionalInfo?.gname || 'N/A',
            gcategory: productDetails?.goodsData?.gcategory || additionalInfo?.gcategory || 'N/A',
            gcostprice: productDetails?.goodsData?.gcostprice || additionalInfo?.gcostprice || 'N/A',
            gunit: productDetails?.goodsData?.gunit || additionalInfo?.gunit || 'N/A'
        },
        stockquantity: movementDetails?.movquantity || productDetails?.stockquantity || 'N/A',
        loc1: productDetails?.loc1 || 'N/A',
        loc2: productDetails?.loc2 || 'N/A',
        loc3: productDetails?.loc3 || 'N/A',
        movdate: movementDetails?.movdate || 'N/A',
    };

    return (
        <div className={product.mobileProductDetail_page}>
            <img src={logo} alt="로고" className={product.logo} />
            <div className={product.mobileProductDetail_box}>
                <div className={product.product_box}>
                    <h4 className={product.product_header}>물품 상세 정보</h4>
                </div>
                <div className={product.product_location} style={{ position: 'relative' }}>
                    {zoneImage ? (
                        <img src={zoneImage} alt="구역 도면" className={product.plan} />
                    ) : (
                        <img src={plan} alt="도면" className={product.plan} />
                    )}
                </div>
                <hr className={product.mobileProductDetail_hr} />
                <div className={product.product_information}>
                    <h4>상세정보</h4>
                    {error ? (
                        <p>에러: {error}</p>
                    ) : (
                        <table className={product.table}>
                            <thead>
                                <tr>
                                    <th>헤더</th>
                                    <th>데이터</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>상품 코드</th>
                                    <td>{details.gcode}</td>
                                </tr>
                                <tr>
                                    <th>상품 이름</th>
                                    <td>{details.goodsData.gname}</td>
                                </tr>
                                <tr>
                                    <th>상품 카테고리</th>
                                    <td>{details.goodsData.gcategory}</td>
                                </tr>
                                <tr>
                                    <th>상품 가격</th>
                                    <td>{details.goodsData.gcostprice.toLocaleString('ko-KR')} ₩</td>
                                </tr>
                                <tr>
                                    <th>입고 수량</th>
                                    <td>{details.stockquantity}{details.goodsData.gunit}</td>
                                </tr>
                                <tr>
                                    <th>위치</th>
                                    <td>{details.loc1}-{details.loc2}-{details.loc3}</td>
                                </tr>
                                <tr>
                                    <th>입고날짜</th>
                                    <td>{details.movdate}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
                <hr className={product.mobileProductDetail_hr} />
                <div className={product.update_location}>
                    <h4>위치 정보 업데이트</h4>
                    <select
                        value={newLoc1}
                        onChange={(e) => setNewLoc1(e.target.value)}
                    >
                        <option value="">선택하세요</option>
                        {loc1Options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <select
                        value={newLoc2}
                        onChange={(e) => setNewLoc2(e.target.value)}
                    >
                        <option value="">선택하세요</option>
                        {loc2Options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <select
                        value={newLoc3}
                        onChange={(e) => setNewLoc3(e.target.value)}
                    >
                        <option value="">선택하세요</option>
                        {loc3Options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <button onClick={updateLocation}>위치 업데이트</button>
                </div>
            </div>
        </div>
    );
};

export default MobileProductDetail;
