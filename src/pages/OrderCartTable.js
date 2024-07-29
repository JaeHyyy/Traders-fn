import { useState, useEffect } from 'react';
import order from './OrderCartTable.module.css';
import axios from 'axios';

const OrderCartTable = ({ columns }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [orderCart, setOrderCart] = useState([]);
     // 발주리스트 전체 조회
  

  useEffect(() => {
    axios.get('http://localhost:8090/traders/ordercart')
      .then(response => {
        setOrderCart(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the goods!', error);
      });
  }, []);


    const handleSelectAll = (event) => {
        if (event.target.checked) {
          setSelectedRows(orderCart.map((_, index) => index));
        } else {
          setSelectedRows([]);
        }
      };
    
      const handleSelectRow = (rowIndex) => {
        if (selectedRows.includes(rowIndex)) {
          setSelectedRows(selectedRows.filter(index => index !== rowIndex));
        } else {
          setSelectedRows([...selectedRows, rowIndex]);
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
                                {row.goods && column.render ? column.render(row) : row[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      <div className={order.tableBottom}>
        <div className={order.total}>
           <p>총&nbsp;&nbsp;{orderCart.length}건&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 총&nbsp;합계:&nbsp;&nbsp;{orderCart.length}원</p>
        </div>    
        <div className={order.tableBottomBtn}>
            <button className={order.orderBtn}>결제하기</button>
            <button className={order.delBtn}>삭제하기</button>
        </div>
      </div>  
   </div>
    );
};

export default OrderCartTable;