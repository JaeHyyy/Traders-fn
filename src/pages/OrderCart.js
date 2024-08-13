import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderCartTable from './OrderCartTable';
import { getAuthToken } from '../util/auth';
import Stock from './Stock'; //동일상품 중복 담기 불가 시키기 위해 필요한 것

const OrderCart = () => {
  const [orderCart, setOrderCart] = useState([]);
  const token = getAuthToken(); // token 값 저장
  const branchId = localStorage.getItem('branchId'); // 저장된 branchId 가져오기

  // branchId로 ordercart db테이블 값 나타내기
  useEffect(() => {


    if (branchId) {
      axios.get(`http://localhost:8090/traders/ordercart/branch/${branchId}`, {
        headers: {
          method: "GET",
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setOrderCart(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the order cart!', error);
        });
    } else {
      console.error('No branchId found in localStorage!');
    }
  }, [branchId]);


  //수량 동적 변경 처리 
  const handleGcount = (rowIndex, value) => {
    console.log('handleGcount called with:', rowIndex, value);
    const newOrderCart = [...orderCart];
    if (newOrderCart[rowIndex]) {
      newOrderCart[rowIndex].gcount = Math.max(value, 1);
      setOrderCart(newOrderCart);
    } else {
      console.error('Invalid rowIndex:', rowIndex);
    }
  };

  const columns = [
    { header: '순번' },
    { header: '상품코드', accessor: 'gcode', render: (row) => row.goods.gcode },
    {
      header: '이미지',
      accessor: 'gimage',
      render: (row) => <img src={`http://localhost:8090/traders/images/items/${row.goods.gimage}.png`} alt={row.goods.gname} style={{ width: '50px', height: '50px' }} />
    },
    { header: '카테고리', accessor: 'gcategory', render: (row) => row.goods.gcategory },
    { header: '상품명(단위)', accessor: 'gname', render: (row) => row.goods.gname },
    { header: '제조사', accessor: 'gcompany', render: (row) => row.goods.gcompany },
    { header: '원가', accessor: 'gcostprice', render: (row) => row.goods.gcostprice.toLocaleString('ko-KR') },
    {
      header: '수량', accessor: 'gcount',
      render: (row, rowIndex) => (
        <input type="number" value={row.gcount} style={{ width: '50px' }}
          onChange={(e) => handleGcount(rowIndex, Number(e.target.value))} />
      )
    },
    { header: '단위', accessor: 'gunit', render: (row) => row.goods.gunit },
    { header: '합계(단위: won)', render: (row) => (row.goods.gcostprice * row.gcount).toLocaleString('ko-KR') }
  ];


  return <OrderCartTable columns={columns} orderCart={orderCart} setOrderCart={setOrderCart} handleGcount={handleGcount} branchId={branchId}/>;

};

export default OrderCart;
