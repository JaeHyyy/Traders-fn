import React, { useState, useEffect } from 'react';
import axios from 'axios';
import receiptt from '../pages/Receipt.module.css';

function Receipt(){

    const [movement, setMovement] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:8090/traders/receipt')
        .then(response => {
          setMovement(response.data);
        })
        .catch(error => {
          console.error('돌아가. 뭔가 잘못되었다.', error);
        });
    }, []);


    return(
        <div className={receiptt.Receipt}>
      <table className={receiptt.receiptTable}>
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
          {movement.map((movement,idx) => (
            <tr key={idx} className={receiptt.movcode}>
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