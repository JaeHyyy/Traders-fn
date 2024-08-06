import { useState, useEffect } from 'react';
import order from './OrderCartTable.module.css';
import axios from 'axios';

const OrderCartTable = ({ columns, orderCart, setOrderCart, handleGcount}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [totalCostPrice, setTotalCostPrice] = useState(0);


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
       

      //체크한 상품 삭제하기
      const handleDelete = () => {
        const selectedItems = selectedRows.map(rowIndex => orderCart[rowIndex].ordercode);
        selectedItems.forEach(ordercode => {
          if (ordercode !== undefined){
            axios.delete(`http://localhost:8090/traders/ordercart/delete/${ordercode}`)
                .then(response => {
                    console.log(`삭제완료`);
                    setOrderCart(prevOrderCart => prevOrderCart.filter(item => item.ordercode !== ordercode));
                })
                .catch(error => {
                    console.error('삭제불가', error);
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
          orderCart.forEach(item  => {
              axios.put(`http://localhost:8090/traders/ordercart/update/${item.ordercode}`, item)
                  .then(response => {
                      console.log(`저장완료: ${item.ordercode}`);
                  })
                  .catch(error => {
                      console.error('저장불가', error);
                  });
          });
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
            <button className={order.orderBtn}>결제하기</button>
            <button className={order.delBtn} onClick={handleDelete}>삭제하기</button>
        </div>
      </div>  
   </div>
    );
};

export default OrderCartTable;