import { useState, useEffect } from 'react';
import order from './OrderCartTable.module.css';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import api from '../util/api';
import { getAuthToken } from '../util/auth';

const OrderCartTable = ({ columns, orderCart, setOrderCart, handleGcount }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalCostPrice, setTotalCostPrice] = useState(0);
  const token = getAuthToken();
  const branchId = localStorage.getItem('branchId'); // 저장된 branchId 가져오기

  //체크박스 전체 선택
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(orderCart.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  //체크박스 해당 행 선택
  const handleSelectRow = (rowIndex) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter(index => index !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  // 체크한 상품 삭제하기
  const handleDelete = () => {
    // 중복된 ordercode를 제거하고 고유한 값만 남기기
    const selectedItems = Array.from(new Set(selectedRows.map(rowIndex => orderCart[rowIndex].ordercode)));

    selectedItems.forEach(ordercode => {
      if (ordercode !== undefined) {
        api.delete(`/traders/ordercart/delete/${branchId}/${ordercode}`)
          .then(response => {
            console.log(`삭제완료`);
            // 삭제된 ordercode에 해당하는 항목들을 모두 필터링하여 상태 업데이트
            setOrderCart(prevOrderCart => prevOrderCart.filter(item => item.ordercode !== ordercode));
            alert("삭제가 완료되었습니다.");
          })
          .catch(error => {
            console.error('삭제불가', error);
            alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
          });
      }
    });
  };




  //발주하기 페이지에 있는 상품들의 총합계
  useEffect(() => {
    const handleTotalCost = () => {
      const total = orderCart.reduce((total, item) => {
        return total + (item.goods ? item.goods.gcostprice * item.gcount : 0);
      }, 0);
      setTotalCostPrice(total);
    };

    handleTotalCost();
  }, [orderCart]);

  // 변경사항 저장하기
  const handleSave = () => {
    orderCart.forEach(item => {
      api.put(`/traders/ordercart/update/${branchId}/${item.ordercode}`, item)
        .then(response => {
          console.log(`저장완료: ${item.ordercode}`);
          console.log(response.data);
        })
        .catch(error => {
          console.error('저장불가', error);
        });
    });
    alert("변경사항 저장 완료되었습니다.");
  };

  // const handlePayment = async () => {
  //   const clientKey = 'test_ck_KNbdOvk5rkOogZa2Qvm4rn07xlzm'; // 하드코딩된 클라이언트 키
  //   const tossPayments = await loadTossPayments(clientKey);

  //   const paymentData = {
  //     amount: totalCostPrice, // 결제 금액
  //     orderId: '1234-4321-0001', // 주문 ID (중복되지 않도록 확인)
  //     orderName: `${branchId} 발주`, // 주문명
  //     customerName: `${branchId}` // 고객명
  //   };

  //   // 오더 카트의 모든 상품 정보를 문자열로 변환
  //   const itemsString = encodeURIComponent(JSON.stringify(orderCart));

  //   try {
  //     // 백엔드에 결제 정보 저장 요청
  //     await api.post(`/traders/payment/${branchId}`, paymentData);

  //     // URL 쿼리 파라미터에 결제 정보를 추가하여 결제 성공 페이지로 리다이렉트
  //     const queryString = new URLSearchParams({
  //       orderId: paymentData.orderId,
  //       amount: paymentData.amount,
  //       customerName: paymentData.customerName,
  //       items: itemsString, // 전체 상품 정보 추가
  //     }).toString();

  //     console.log("paymentData: ", paymentData);

  //     // 결제 요청
  //     tossPayments.requestPayment('카드', {
  //       ...paymentData,
  //       successUrl: `http://localhost:3000/traders/payment/PaymentSuccess?${queryString}`,
  //       failUrl: 'http://localhost:3000/traders/payment/fail'
  //     });
  //   } catch (error) {
  //     console.error('결제 요청 중 오류 발생:', error);
  //   }
  // };

  const handlePayment = async () => {
    const clientKey = 'test_ck_KNbdOvk5rkOogZa2Qvm4rn07xlzm'; // 하드코딩된 클라이언트 키
    const tossPayments = await loadTossPayments(clientKey);

    const paymentData = {
      amount: totalCostPrice, // 결제 금액
      orderId: '1234-4321-0001', // 주문 ID (중복되지 않도록 확인)

      orderName: `${branchId} 발주`, // 주문명
      customerName: `${branchId}` // 고객명
    };

    // 오더 카트의 모든 상품 정보를 문자열로 변환
    const itemsString = encodeURIComponent(JSON.stringify(orderCart));

    try {
      // 백엔드에 결제 정보 저장 요청
      await api.post(`/traders/payment/${branchId}`, paymentData);

      // URL 쿼리 파라미터에 결제 정보를 추가하여 결제 성공 페이지로 리다이렉트
      const queryString = new URLSearchParams({
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        customerName: paymentData.customerName,
        items: itemsString, // 전체 상품 정보 추가
      }).toString();

      console.log("paymentData: ", paymentData);

      // 결제 요청
      tossPayments.requestPayment('카드', {
        ...paymentData,
        successUrl: `http://localhost:3000/traders/payment/PaymentSuccess?${queryString}`,
        failUrl: 'http://localhost:3000/traders/payment/fail'
      });

    } catch (error) {
      console.error('결제 요청 중 오류 발생:', error);
    }
  };

  return (
    <div className={order.OrderCart}>
      <div className={order.OrderCartTable}>
        <table className={order.custom}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === orderCart.length}
                />
              </th>

              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderCart.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleSelectRow(rowIndex)}
                    checked={selectedRows.includes(rowIndex)}
                  />
                </td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {row.goods && column.render ? column.render(row, rowIndex) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={order.tableBottom}>
        <div className={order.total}>
          <p>총&nbsp;&nbsp;{orderCart.length}건&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 총&nbsp;합계:&nbsp;&nbsp;{totalCostPrice.toLocaleString('ko-KR')}원</p>
        </div>
        <div className={order.tableBottomBtn}>
          <button className={order.saveBtn} onClick={handleSave}>변경저장</button>
          <button className={order.orderBtn} onClick={handlePayment}>결제하기</button>
          <button className={order.delBtn} onClick={handleDelete}>삭제하기</button>
        </div>
      </div>
    </div>
  );
};

export default OrderCartTable;
