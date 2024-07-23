import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Receipt(){

    const [receiptData, setReceiptData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceiptData = async () => {
          try {
            const response = await axios.get('http://localhost:8090/traders/income');
            setReceiptData(response.data);
            setLoading(false);
          } catch (error) {
            setError(error);
            setLoading(false);
          }
        };
    
        fetchReceiptData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return(
        <div>
      <h1>입고 목록</h1>
      <table>
        <thead>
          <tr>
            <th>입고 번호</th>
            <th>발주 번호</th>
            <th>상품 번호</th>
            <th>입고 날짜</th>
            <th>수량</th>
            <th>입고 상태</th>
          </tr>
        </thead>
        <tbody>
          {receiptData.map((movement) => (
            <tr key={movement.movcode}>
              <td>{movement.movcode}</td>
              <td>{movement.ordercode}</td>
              <td>{movement.gcode}</td>
              <td>{movement.movdate}</td>
              <td>{movement.movquantity}</td>
              <td>{movement.movstatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}

export default Receipt;