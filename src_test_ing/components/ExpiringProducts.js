import { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import main from '../pages/Main.module.css';
import Calendar from '../components/Calendar';

const ExpiringProducts = () => {
  const [expiringProducts, setExpiringProducts] = useState([]);

  const handleDateSelect = (selectedDate) => {
    axios.get(`http://localhost:8090/traders/expiring-products?date=${format(selectedDate, 'yyyy-MM-dd')}`)
      .then(response => {
        setExpiringProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the expiring products!', error);
      });
  };

  return (
    <div className={main.locCalender}>
      <Calendar onDateSelect={handleDateSelect} />
      <div className={main.disuseList}>
        <table className={main.disuseTable}>
          <thead>
            <tr>
              <th style={{ width: '70px' }}>상품번호</th>
              <th>제품코드</th>
              <th>상품명</th>
              <th>유통기한</th>
            </tr>
          </thead>
          <tbody>
            {expiringProducts.map((product, index) => (
              <tr key={index} className={main.disuseItem}>
                <td>{product.num}</td>
                <td>{product.stockid}</td>
                <td>{product.gname}</td>
                <td>{product.expdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiringProducts;