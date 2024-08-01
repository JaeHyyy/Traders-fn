// import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import logo from '../assets/logo.png';
// import plan from '../assets/warehouse drawing.png';
// import product from './MobileProductDetail.module.css';

// const MobileProductDetail = () => {
//     const { gcode } = useParams();  // URL에서 gcode 파라미터를 가져옵니다.
//     const [markerPosition, setMarkerPosition] = useState(null);  // 마커 위치 상태
//     const [productDetails, setProductDetails] = useState(null);  // 제품 상세 정보 상태
//     const [error, setError] = useState(null);  // 오류 상태

//     // gcode를 사용하여 제품 상세 정보를 가져오는 함수
//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             try {
//                 console.log(`Fetching product details for gcode: ${gcode}`);
//                 const response = await axios.get(`http://localhost:8090/traders/stock/gcode-data/${gcode}`);
//                 const data = response.data[0]; // 배열의 첫 번째 요소를 사용
//                 if (data) {
//                     console.log('응답 본문:', data);
//                     setProductDetails(data);  // 제품 상세 정보 설정
//                 } else {
//                     console.log('데이터가 없습니다');
//                     setProductDetails(null);  // 데이터가 없으면 null 설정
//                 }
//             } catch (error) {
//                 console.error("제품 상세 정보 가져오기 오류:", error);
//                 if (error.response) {
//                     setError(`서버 오류: ${error.response.status} ${error.response.statusText}`);
//                 } else if (error.request) {
//                     setError("서버로부터 응답을 받지 못했습니다.");
//                 } else {
//                     setError("요청을 설정하는 중 오류가 발생했습니다.");
//                 }
//                 setProductDetails(null);  // 오류 발생 시 null 설정
//             }
//         };

//         fetchProductDetails();
//     }, [gcode]);

//     // 이미지 클릭 시 마커 위치를 설정하는 함수
//     const handleImageClick = (e) => {
//         if (markerPosition !== null) return;

//         const rect = e.target.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         const newPosition = { x, y };

//         console.log('이미지 클릭:', { x, y });
//         setMarkerPosition(newPosition);
//         localStorage.setItem(`markerPosition_${gcode}`, JSON.stringify(newPosition));  // gcode에 따른 마커 위치 저장
//     };

//     // 위치 초기화 함수
//     const handleResetClick = () => {
//         console.log('위치 초기화');
//         setMarkerPosition(null);
//         localStorage.removeItem(`markerPosition_${gcode}`);  // gcode에 따른 마커 위치 삭제
//     };

//     // 컴포넌트가 마운트되었을 때 또는 gcode가 변경되었을 때 저장된 마커 위치를 불러옴
//     useEffect(() => {
//         const savedPosition = localStorage.getItem(`markerPosition_${gcode}`);
//         if (savedPosition) {
//             console.log('저장된 위치 불러오기:', savedPosition);
//             setMarkerPosition(JSON.parse(savedPosition));
//         }
//     }, [gcode]);

//     // 데이터가 없는 경우 기본값 설정
//     const details = productDetails ? {
//         gcode: productDetails.gcode,
//         goodsData: {
//             gname: productDetails.goodsData?.gname || 'N/A',
//             gcategory: productDetails.goodsData?.gcategory || 'N/A',
//             gcostprice: productDetails.goodsData?.gcostprice || 'N/A',
//         },
//         stockquantity: productDetails.stockquantity || 'N/A',
//         loc1: productDetails.loc1 || 'N/A',
//         loc2: productDetails.loc2 || 'N/A',
//         loc3: productDetails.loc3 || 'N/A',
//         expdate: productDetails.expdate || 'N/A',
//     } : {
//         gcode: gcode,
//         goodsData: {
//             gname: 'N/A',
//             gcategory: 'N/A',
//             gcostprice: 'N/A',
//         },
//         stockquantity: 'N/A',
//         loc1: 'N/A',
//         loc2: 'N/A',
//         loc3: 'N/A',
//         expdate: 'N/A',
//     };

//     return (
//         <div className={product.mobileProductDetail_page}>
//             <div className={product.mobileProductDetail_box}>
//                 <img src={logo} alt="로고" className={product.logo} />
//                 <div className={product.product_box}>
//                     <h4 className={product.product_header}>물품상세정보</h4>
//                 </div>
//                 <div className={product.product_location} onClick={handleImageClick}>
//                     <img src={plan} alt="도면" className={product.plan} />
//                     {markerPosition && (
//                         <div
//                             className={product.blinking_circle}
//                             style={{
//                                 top: markerPosition.y,
//                                 left: markerPosition.x
//                             }}
//                         ></div>
//                     )}
//                 </div>
//                 <button className={product.reset_button} onClick={handleResetClick}>
//                     위치 초기화
//                 </button>
//                 <div className={product.product_information}>
//                     {error ? (
//                         <p>에러: {error}</p>
//                     ) : (
//                         <table className={product.table}>
//                             <thead>
//                                 <tr>
//                                     <th>헤더</th>
//                                     <th>데이터</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <th>상품 코드</th>
//                                     <td>{details.gcode}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 이름</th>
//                                     <td>{details.goodsData.gname}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 카테고리</th>
//                                     <td>{details.goodsData.gcategory}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 가격</th>
//                                     <td>{details.goodsData.gcostprice}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>재고 수량</th>
//                                     <td>{details.stockquantity}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>위치</th>
//                                     <td>{details.loc1}-{details.loc2}-{details.loc3}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>유통 기한</th>
//                                     <td>{details.expdate}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileProductDetail;

// --------------------------------------------------------------------------------------

// import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import logo from '../assets/logo.png';
// import plan from '../assets/warehouse drawing.png';
// // import product from './MobileProductDetail.module.css';
// import product from './MobileProductDetail2.module.css';


// const MobileProductDetail = () => {
//     const { gcode } = useParams();  // URL에서 gcode 파라미터를 가져옵니다.
//     const [markerPosition, setMarkerPosition] = useState(null);  // 마커 위치 상태
//     const [productDetails, setProductDetails] = useState(null);  // 제품 상세 정보 상태
//     const [error, setError] = useState(null);  // 오류 상태

//     // gcode를 사용하여 제품 상세 정보를 가져오는 함수
//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             try {
//                 console.log(`Fetching product details for gcode: ${gcode}`);
//                 const response = await axios.get(`http://localhost:8090/traders/stock/gcode-data/${gcode}`);
//                 const response2 = await axios.get(`http://localhost:8090/traders/goods/${gcode}`);
//                 const data = response.data[0]; // 배열의 첫 번째 요소를 사용
//                 if (data) {
//                     console.log('응답 본문:', data);
//                     setProductDetails(data);  // 제품 상세 정보 설정
//                 } else {
//                     console.log('데이터가 없습니다');
//                     setProductDetails(null);  // 데이터가 없으면 null 설정
//                 }
//             } catch (error) {
//                 console.error("제품 상세 정보 가져오기 오류:", error);
//                 if (error.response) {
//                     setError(`서버 오류: ${error.response.status} ${error.response.statusText}`);
//                 } else if (error.request) {
//                     setError("서버로부터 응답을 받지 못했습니다.");
//                 } else {
//                     setError("요청을 설정하는 중 오류가 발생했습니다.");
//                 }
//                 setProductDetails(null);  // 오류 발생 시 null 설정
//             }
//         };

//         fetchProductDetails();
//     }, [gcode]);

//     // 이미지 클릭 시 마커 위치를 설정하는 함수
//     const handleImageClick = (e) => {
//         if (markerPosition !== null) return;

//         const rect = e.target.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         const newPosition = { x, y };

//         console.log('이미지 클릭:', { x, y });
//         setMarkerPosition(newPosition);
//         localStorage.setItem(`markerPosition_${gcode}`, JSON.stringify(newPosition));  // gcode에 따른 마커 위치 저장
//     };

//     // 위치 초기화 함수
//     const handleResetClick = () => {
//         console.log('위치 초기화');
//         setMarkerPosition(null);
//         localStorage.removeItem(`markerPosition_${gcode}`);  // gcode에 따른 마커 위치 삭제
//     };

//     // 컴포넌트가 마운트되었을 때 또는 gcode가 변경되었을 때 저장된 마커 위치를 불러옴
//     useEffect(() => {
//         const savedPosition = localStorage.getItem(`markerPosition_${gcode}`);
//         if (savedPosition) {
//             console.log('저장된 위치 불러오기:', savedPosition);
//             setMarkerPosition(JSON.parse(savedPosition));
//         }
//     }, [gcode]);

//     // 데이터가 없는 경우 기본값 설정
//     const details = productDetails ? {
//         gcode: productDetails.gcode,
//         goodsData: {
//             gname: productDetails.goodsData?.gname || 'N/A',
//             gcategory: productDetails.goodsData?.gcategory || 'N/A',
//             gcostprice: productDetails.goodsData?.gcostprice || 'N/A',
//         },
//         stockquantity: productDetails.stockquantity || 'N/A',
//         loc1: productDetails.loc1 || 'N/A',
//         loc2: productDetails.loc2 || 'N/A',
//         loc3: productDetails.loc3 || 'N/A',
//         expdate: productDetails.expdate || 'N/A',
//     } : {
//         gcode: gcode,
//         goodsData: {
//             gname: 'N/A',
//             gcategory: 'N/A',
//             gcostprice: 'N/A',
//         },
//         stockquantity: 'N/A',
//         loc1: 'N/A',
//         loc2: 'N/A',
//         loc3: 'N/A',
//         expdate: 'N/A',
//     };

//     return (
//         <div className={product.mobileProductDetail_page}>
//             <div className={product.mobileProductDetail_box}>
//                 <img src={logo} alt="로고" className={product.logo} />
//                 <div className={product.product_box}>
//                     <h4 className={product.product_header}>물품상세정보</h4>
//                 </div>
//                 <div className={product.product_location} onClick={handleImageClick}>
//                     <img src={plan} alt="도면" className={product.plan} />
//                     {markerPosition && (
//                         <div
//                             className={product.blinking_circle}
//                             style={{
//                                 top: markerPosition.y,
//                                 left: markerPosition.x
//                             }}
//                         ></div>
//                     )}
//                 </div>
//                 <button className={product.reset_button} onClick={handleResetClick}>
//                     위치 초기화
//                 </button>
//                 <div className={product.product_information}>
//                     {error ? (
//                         <p>에러: {error}</p>
//                     ) : (
//                         <table className={product.table}>
//                             <thead>
//                                 <tr>
//                                     <th>헤더</th>
//                                     <th>데이터</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <th>상품 코드</th>
//                                     <td>{details.gcode}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 이름</th>
//                                     <td>{details.goodsData.gname}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 카테고리</th>
//                                     <td>{details.goodsData.gcategory}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 가격</th>
//                                     <td>{details.goodsData.gcostprice}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>재고 수량</th>
//                                     <td>{details.stockquantity}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>위치</th>
//                                     <td>{details.loc1}-{details.loc2}-{details.loc3}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>유통 기한</th>
//                                     <td>{details.expdate}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileProductDetail;


// --------------------------------------------------------------------------------------

// import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import logo from '../assets/logo.png';
// import plan from '../assets/warehouse drawing.png';  // 사용 경로에 맞게 업데이트
// import product from './MobileProductDetail2.module.css';

// const MobileProductDetail = () => {
//     const { gcode } = useParams();  // URL에서 gcode 파라미터를 가져옵니다.
//     const [markerPosition, setMarkerPosition] = useState(null);  // 마커 위치 상태
//     const [productDetails, setProductDetails] = useState(null);  // 제품 상세 정보 상태
//     const [additionalInfo, setAdditionalInfo] = useState(null);  // 추가 정보 상태
//     const [error, setError] = useState(null);  // 오류 상태

//     // gcode를 사용하여 제품 상세 정보와 추가 정보를 가져오는 함수
//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             try {
//                 console.log(`gcode ${gcode}에 대한 제품 상세 정보 가져오기`);

//                 // 제품 상세 정보와 추가 정보를 동시에 가져오기
//                 const [response1, response2] = await Promise.all([
//                     axios.get(`http://localhost:8090/traders/stock/gcode-data/${gcode}`),
//                     axios.get(`http://localhost:8090/traders/goods/${gcode}`)
//                 ]);

//                 const data1 = response1.data[0];  // 배열의 첫 번째 요소를 사용
//                 const data2 = response2.data;

//                 // response1 데이터 설정
//                 if (data1) {
//                     console.log('stock + goods:', data1);
//                     setProductDetails(data1);  // 제품 상세 정보 설정
//                 } else {
//                     console.log('stock 데이터가 없습니다');
//                     setProductDetails(null);  // 데이터가 없으면 null 설정
//                 }

//                 // response2 데이터 설정
//                 if (data2) {
//                     console.log("goods:", data2);
//                     setAdditionalInfo(data2);  // 추가 정보 설정
//                 } else {
//                     console.log('goods 데이터가 없습니다.');
//                     setAdditionalInfo(null);
//                 }

//             } catch (error) {
//                 console.error("제품 상세 정보 가져오기 오류:", error);
//                 if (error.response) {
//                     setError(`서버 오류: ${error.response.status} ${error.response.statusText}`);
//                 } else if (error.request) {
//                     setError("서버로부터 응답을 받지 못했습니다.");
//                 } else {
//                     setError("요청을 설정하는 중 오류가 발생했습니다.");
//                 }
//                 setProductDetails(null);  // 오류 발생 시 null 설정
//                 setAdditionalInfo(null);
//             }
//         };

//         fetchProductDetails();
//     }, [gcode]);

//     // 이미지 클릭 시 마커 위치를 설정하는 함수
//     const handleImageClick = (e) => {
//         if (markerPosition !== null) return;

//         const rect = e.target.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         const newPosition = { x, y };

//         console.log('이미지 클릭:', { x, y });
//         setMarkerPosition(newPosition);
//         localStorage.setItem(`markerPosition_${gcode}`, JSON.stringify(newPosition));  // gcode에 따른 마커 위치 저장
//     };

//     // 위치 초기화 함수
//     const handleResetClick = () => {
//         console.log('위치 초기화');
//         setMarkerPosition(null);
//         localStorage.removeItem(`markerPosition_${gcode}`);  // gcode에 따른 마커 위치 삭제
//     };

//     // 컴포넌트가 마운트되었을 때 또는 gcode가 변경되었을 때 저장된 마커 위치를 불러옴
//     useEffect(() => {
//         const savedPosition = localStorage.getItem(`markerPosition_${gcode}`);
//         if (savedPosition) {
//             console.log('저장된 위치 불러오기:', savedPosition);
//             setMarkerPosition(JSON.parse(savedPosition));
//         }
//     }, [gcode]);

//     // 데이터가 없는 경우 기본값 설정
//     const details = productDetails ? {
//         gcode: productDetails.gcode,
//         goodsData: {
//             gname: productDetails.goodsData?.gname || additionalInfo?.gname || 'N/A',
//             gcategory: productDetails.goodsData?.gcategory || additionalInfo?.gcategory || 'N/A',
//             gcostprice: productDetails.goodsData?.gcostprice || additionalInfo?.gcostprice || 'N/A',
//         },
//         stockquantity: productDetails.stockquantity || 'N/A',
//         loc1: productDetails.loc1 || 'N/A',
//         loc2: productDetails.loc2 || 'N/A',
//         loc3: productDetails.loc3 || 'N/A',
//         expdate: productDetails.expdate || 'N/A',
//     } : {
//         gcode: gcode,
//         goodsData: {
//             gname: additionalInfo?.gname || 'N/A',
//             gcategory: additionalInfo?.gcategory || 'N/A',
//             gcostprice: additionalInfo?.gcostprice || 'N/A',
//         },
//         stockquantity: 'N/A',
//         loc1: 'N/A',
//         loc2: 'N/A',
//         loc3: 'N/A',
//         expdate: 'N/A',
//     };

//     return (
//         <div className={product.mobileProductDetail_page}>
//             <div className={product.mobileProductDetail_box}>
//                 <img src={logo} alt="로고" className={product.logo} />
//                 <div className={product.product_box}>
//                     <h4 className={product.product_header}>물품 상세 정보</h4>
//                 </div>
//                 <div className={product.product_location} onClick={handleImageClick}>
//                     <img src={plan} alt="도면" className={product.plan} />
//                     {markerPosition && (
//                         <div
//                             className={product.blinking_circle}
//                             style={{
//                                 top: markerPosition.y,
//                                 left: markerPosition.x
//                             }}
//                         ></div>
//                     )}
//                 </div>
//                 <button className={product.reset_button} onClick={handleResetClick}>
//                     위치 초기화
//                 </button>
//                 <div className={product.product_information}>
//                     {error ? (
//                         <p>에러: {error}</p>
//                     ) : (
//                         <table className={product.table}>
//                             <thead>
//                                 <tr>
//                                     <th>헤더</th>
//                                     <th>데이터</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <th>상품 코드</th>
//                                     <td>{details.gcode}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 이름</th>
//                                     <td>{details.goodsData.gname}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 카테고리</th>
//                                     <td>{details.goodsData.gcategory}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>상품 가격</th>
//                                     <td>{details.goodsData.gcostprice}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>입고 수량</th>
//                                     <td>{details.stockquantity}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>위치</th>
//                                     <td>{details.loc1}-{details.loc2}-{details.loc3}</td>
//                                 </tr>
//                                 <tr>
//                                     <th>유통 기한</th>
//                                     <td>{details.expdate}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileProductDetail;

// --------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import plan from '../assets/warehouse drawing.png';  // 사용 경로에 맞게 업데이트
import product from './MobileProductDetail2.module.css';

const MobileProductDetail = () => {
    const { gcode } = useParams();  // URL에서 gcode 파라미터를 가져옵니다.
    const [markerPosition, setMarkerPosition] = useState(null);  // 마커 위치 상태
    const [productDetails, setProductDetails] = useState(null);  // 제품 상세 정보 상태
    const [additionalInfo, setAdditionalInfo] = useState(null);  // 추가 정보 상태
    const [movementDetails, setMovementDetails] = useState(null);  // movement 데이터 상태
    const [error, setError] = useState(null);  // 오류 상태

    // gcode를 사용하여 제품 상세 정보와 추가 정보를 가져오는 함수
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                console.log(`gcode ${gcode}에 대한 제품 상세 정보 가져오기`);

                // 제품 상세 정보와 추가 정보를 동시에 가져오기
                const [response1, response2, response3] = await Promise.all([
                    axios.get(`http://localhost:8090/traders/stock/gcode-data/${gcode}`),
                    axios.get(`http://localhost:8090/traders/goods/${gcode}`),
                    axios.get(`http://localhost:8090/traders/movement/${gcode}`)
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

    // 이미지 클릭 시 마커 위치를 설정하는 함수
    const handleImageClick = (e) => {
        if (markerPosition !== null) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newPosition = { x, y };

        console.log('이미지 클릭:', { x, y });
        setMarkerPosition(newPosition);
        localStorage.setItem(`markerPosition_${gcode}`, JSON.stringify(newPosition));  // gcode에 따른 마커 위치 저장
    };

    // 위치 초기화 함수
    const handleResetClick = () => {
        console.log('위치 초기화');
        setMarkerPosition(null);
        localStorage.removeItem(`markerPosition_${gcode}`);  // gcode에 따른 마커 위치 삭제
    };

    // 컴포넌트가 마운트되었을 때 또는 gcode가 변경되었을 때 저장된 마커 위치를 불러옴
    useEffect(() => {
        const savedPosition = localStorage.getItem(`markerPosition_${gcode}`);
        if (savedPosition) {
            console.log('저장된 위치 불러오기:', savedPosition);
            setMarkerPosition(JSON.parse(savedPosition));
        }
    }, [gcode]);

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
            <div className={product.mobileProductDetail_box}>
                <img src={logo} alt="로고" className={product.logo} />
                <div className={product.product_box}>
                    <h4 className={product.product_header}>물품 상세 정보</h4>
                </div>
                <div className={product.product_location} onClick={handleImageClick}>
                    <img src={plan} alt="도면" className={product.plan} />
                    {markerPosition && (
                        <div
                            className={product.blinking_circle}
                            style={{
                                top: markerPosition.y,
                                left: markerPosition.x
                            }}
                        ></div>
                    )}
                </div>
                <button className={product.reset_button} onClick={handleResetClick}>
                    위치 초기화
                </button>
                <div className={product.product_information}>
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
            </div>
        </div>
    );
};

export default MobileProductDetail;






