import React, { useState, useEffect } from 'react';
import main from '../pages/Main.module.css';
// import Calendar2 from '../components/Calendar2';
import Calendar from '../components/Calendar';
import axios from 'axios';
import { format } from 'date-fns'; 


function Main() {

  const [date, setDate] = useState(new Date());
  const [goods, setGoods] = useState([]);
  const [searchGoods, setSearchGoods] = useState('');
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [selectedGoods, setSelectedGoods] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8090/traders/home')
      .then(response => {
        setGoods(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the goods!', error);
      });
  }, []);


  
  const handleSearch = (event) => {
    event.preventDefault();
    axios.get(`http://localhost:8090/traders/home/${searchGoods}`)
      .then(response => {
        setGoods(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the goods!', error);
      });
  };

  const handleDateSelect = (selectedDate) => {
    // 여기서 선택된 날짜에 해당하는 유통기한 임박 상품을 가져오는 API 호출을 수행
    axios.get(`http://localhost:8090/traders/expiring-products?date=${format(selectedDate, 'yyyy-MM-dd')}`)
      .then(response => {
        setExpiringProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the expiring products!', error);
      });
  };

  const handleSelect = (gcode) => {
    setSelectedGoods(prevSelectedGoods =>
      prevSelectedGoods.includes(gcode)
        ? prevSelectedGoods.filter(gcode => gcode !== gcode)
        : [...prevSelectedGoods, gcode]
    );
  };
  const handleOrder = () => {
    const selectedItems = goods.filter(item => selectedGoods.includes(item.gcode));
    const orderCartDTOs = selectedItems.map(item => ({
        
        gcount: 1, // 필요에 따라 수정
        goods: {
            gcode: item.gcode,
            gcategory: item.gcategory,
            gname: item.gname,
            gcostprice: item.gcostprice,
            gimage: item.gimage,
            gcompany: item.gcompany,
            gunit: item.gunit,
        }
    }));
    axios.post('http://localhost:8090/traders/ordercart/saveAll', orderCartDTOs)
      .then(response => {
        console.log('Order placed successfully:', response);
        console.log('Response data:', response.data);
      })
      .catch(error => {
        console.error('There was an error placing the order!', error);
      });
};

  const stock = [
    { num: 1, stockid: "2407210001", gname: "대왕님표여주쌀10kg", quantity: "2", gunit: "개" }

  ];



  return (
    <div className={main.Main}>
      <div className={main.goods_page}>
        <div className={main.leftSection}>
          <form onSubmit={handleSearch} id='goods-form'>
            <input type='search'
              name='goods_search'
              placeholder='제품코드, 카테고리명, 상품명 검색'
              className={main.inputGoodsSearch}
              value={searchGoods}
              onChange={(e) => setSearchGoods(e.target.value)} />
            <button type="submit" className={main.btnGoodsSearch}>검색</button>
          </form>
          <div className={main.goodsList}>
            <table className={main.goodsTable}>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}><input type="checkbox" /></th>
                  <th style={{ width: '65px' }}>제품번호</th>
                  <th>제품코드</th>
                  <th>카테고리</th>
                  <th>상품명(단위)</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((goods, index) => (
                  <tr key={index} className={main.goodsItem}>
                    <td><input    type="checkbox"
                        checked={selectedGoods.includes(goods.gcode)}
                        onChange={() => handleSelect(goods.gcode)} /></td>
                    <td>{goods.num}</td>
                    <td>{goods.gcode}</td>
                    <td>{goods.gcategory}</td>
                    <td>{goods.gname}</td>
                    <td>{goods.gcostprice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button className={main.orBtn} onClick={handleOrder}>발주하기</button>

          <div className={main.events}>
            이벤트 슬라이드
          </div>
        </div>
      </div>

      <div className={main.rightsection}>
         <div className={main.locCalender}>
            <Calendar onDateSelect={handleDateSelect} />
        </div>
        <div className={main.tableLabel}>
          <div className={main.tableLabel2}>유통기한 임박 상품 리스트</div>
          <div className={main.tableLabel3}>재고 부족 상품 리스트</div>
        </div>
        <div className={main.rightSectionBox}>
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

          <div className={main.stockList}>
            <table className={main.stockTable}>
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>상품번호</th>
                  <th>제품코드</th>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>단위</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((stock, index) => (
                  <tr key={index} className={main.stockItem}>
                    <td>{stock.num}</td>
                    <td>{stock.stockid}</td>
                    <td>{stock.gname}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.gunit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
