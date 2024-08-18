import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';
import axios from 'axios'; // Axios를 가져옵니다.
import { getAuthToken } from '../util/auth';


function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const customerName = searchParams.get('customerName');
  const items = JSON.parse(decodeURIComponent(searchParams.get('items')) || '[]'); // 모든 상품 정보 가져오기
  const token = getAuthToken(); // token 값 저장

  const handleComplete = async () => {
    //async/await 는 비동기(try, catch처럼 순서대로 실행되지 않는 로직)작업할때 많이 씀
    // 무브먼트에 저장할 데이터 구성
    const movementData = items.map(item => ({
      ordercode: orderId, // 주문 ID
      branchid: customerName, // 지점명 (branchId로 사용)
      gcode: item.goods.gcode, // 상품 코드
      movquantity: item.gcount, // 수량
      movdate: new Date().toISOString().split('T')[0], // 오늘 날짜 (YYYY-MM-DD 형식)
      movstatus: '출고대기' // 고정된 상태
    }));

    try {
      // 무브먼트 DB에 저장하기 위한 POST 요청
      const response = await axios.post('http://TradersApp5.us-east-2.elasticbeanstalk.com/traders/movement/ordersave', movementData,
        {
          headers: {
            "content-type": 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
      console.log('저장 완료:', response.data);
      // 저장 완료 후 대시보드 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
    //   ordercode: orderId, // 주문 ID
    //   branchid: customerName, // 지점명 (branchId로 사용)
    //   gcode: item.goods.gcode, // 상품 코드
    //   movquantity: item.gcount, // 수량
    //   movdate: new Date().toISOString().split('T')[0], // 오늘 날짜 (YYYY-MM-DD 형식)
    //   movstatus: '출고대기' // 고정된 상태
    // }));

    // try {
    //   // 무브먼트 DB에 저장하기 위한 POST 요청
    //   const response = await axios.post('http://TradersApp5.us-east-2.elasticbeanstalk.com/traders/movement/ordersave', movementData,
    //       {
    //           headers: {
    //               "content-type": 'application/json',
    //               Authorization: `Bearer ${token}`,
    //           }
    //       });
    //   console.log('저장 완료:', response.data);
    //   // 저장 완료 후 대시보드 페이지로 이동
    //   navigate('/');
    // } catch (error) {
    //   console.error('저장 중 오류 발생:', error);
    //   alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    // }
  };

  return (
    <div className="payment-success-container">
      <h1 className="success-title">결제 성공</h1>
      <div className="success-details">
        <p className="detail">지점명: <span className="highlight">{customerName}</span></p>
        <p className="detail">주문 ID: <span className="highlight">{orderId}</span></p>
        <p className="detail">결제 금액: <span className="highlight">{amount}원</span></p>

        <h2>구매한 상품 목록</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              상품명: {item.goods?.gname} 상품코드: {item.goods.gcode} 가격: {item.goods?.gcostprice.toLocaleString('ko-KR')}원 수량: {item.gcount}개
            </li>
          ))}
        </ul>
      </div>
      <button className="complete-button" onClick={handleComplete}>결제완료</button>
    </div>
  );
}

export default PaymentSuccess;