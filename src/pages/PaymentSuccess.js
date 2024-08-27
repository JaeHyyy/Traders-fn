import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';
import api from '../util/api'; // api를 가져옵니다.
import { useState, useEffect } from 'react';
import paysu from '../assets/paysu.png';

function PaymentSuccess({ setOrderCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const customerName = searchParams.get('customerName');
  const items = JSON.parse(decodeURIComponent(searchParams.get('items')) || '[]'); // 모든 상품 정보 가져오기

  const [showDetails, setShowDetails] = useState(false);

  const handleComplete = async () => {
    // 무브먼트에 저장할 데이터 구성
    const movementData = items.map(item => ({
      ordercode: orderId, // 주문 ID
      branchid: customerName, // 지점명 (branchId로 사용)
      gcode: item.goods.gcode, // 상품 코드
      movquantity: item.gcount, // 수량
      movdate: new Date().toISOString().split('T')[0], // 오늘 날짜 (YYYY-MM-DD 형식)
      movstatus: '출고 대기' // 고정된 상태
    }));

    try {
      // 무브먼트 DB에 저장하기 위한 POST 요청
      const response = await api.post('/traders/movement/ordersave', movementData);
      console.log('저장 완료:', response.data);

      // 결제 성공 후 선택한 상품 삭제
      const branchId = customerName; // 지점명을 branchId로 사용

      // ordercode 중복 제거
      const uniqueOrderCodes = [...new Set(items.map(item => item.ordercode))];

      // 각 고유한 ordercode에 대해 삭제 요청을 실행
      const deletedOrderCodes = new Set(); // 삭제된 ordercode를 추적하기 위한 Set

      for (const ordercode of uniqueOrderCodes) {
        if (ordercode !== undefined && !deletedOrderCodes.has(ordercode)) {
          try {
            await api.delete(`/traders/ordercart/delete/${branchId}/${ordercode}`);
            console.log(`삭제 완료: ${ordercode}`);
            deletedOrderCodes.add(ordercode); // 삭제된 ordercode를 Set에 추가
          } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
          }
        }
      }

      // 저장 및 삭제 완료 후 대시보드 페이지로 이동
      alert('결제가 완료되고, 선택된 항목이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  useEffect(() => {
    // 2초 후에 상세 정보를 표시
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 800);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  }, []);


  return (
    <div className="payment-success-container">
      <img src={paysu} alt='완료체크이미지' className='payimg' />
      <h1 className="success-title">결제 성공!</h1>
      {/* 상세 내역은 showDetails가 true일 때만 표시 */}
      {/* {showDetails && ( */}
      <div className={`success-details ${showDetails ? 'show' : ''}`}>
        <div className='detail_box'>
          <p className="detail">
            <span className="detail-label">지점명:</span>
            <span className="highlight">{customerName}</span>
          </p>
          <p className="detail">
            <span className="detail-label">주문 ID:</span>
            <span className="highlight">{orderId}</span>
          </p>
          <p className="detail">
            <span className="detail-label">결제 금액:</span>
            <span className="highlight">{parseInt(amount, 10).toLocaleString('ko-KR')}원</span>
          </p>
        </div>

        <h2 className='buy_list'>구매한 상품 목록</h2>
        <div className="buy_table">
          <table className='buytab'>
            <thead>
              <tr>
                <th className='buyth'>상품명</th>
                <th className='buyth'>상품코드</th>
                <th className='buyth'>가격</th>
                <th className='buyth'>수량</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className='buytd'>{item.goods?.gname}</td>
                  <td className='buytd'>{item.goods.gcode}</td>
                  <td className='buytd'>{item.goods?.gcostprice.toLocaleString('ko-KR')}원</td>
                  <td className='buytd'>{item.gcount}개</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="complete-button" onClick={handleComplete}>결제완료</button>
      </div>
      {/* )} */}
    </div>
  );
}

export default PaymentSuccess;
