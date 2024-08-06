import React, { useState, useEffect, useRef } from 'react';
import main from '../pages/Main.module.css';
import Calendar from '../components/Calendar';
import axios from 'axios';
import { format } from 'date-fns';

function Main() {
  const [goods, setGoods] = useState([]);
  const [searchGoods, setSearchGoods] = useState('');
  const [stock, setStock] = useState([]);
  const [stockk, setStockk] = useState([]); // 재고부족 상품 상태
  const [selectedGoods, setSelectedGoods] = useState([]);
  const prevSelectedDate = useRef(null);  // 이전에 선택한 날짜를 추적하는 ref
  const [expiringMessage, setExpiringMessage] = useState('');  // 메시지를 저장할 상태 추가

  useEffect(() => {
    axios.get('http://localhost:8090/traders/home')
      .then(response => {
        setGoods(response.data);
      })
      .catch(error => {
        console.error('goods상품 조회 불가', error);
      });

    // 재고부족 상품 리스트 조회
    axios.get('http://localhost:8090/traders/stock')
      .then(response => {
        const currentDate = new Date();
        const shortage = response.data.filter(stock => {
          // 유통기한이 지나지 않았고 재고가 10개 이하인 상품만 선택
          const expirationDate = new Date(stock.expdate); // 유통기한 날짜
          return expirationDate > currentDate && stock.stockquantity <= 10;
        })
          .sort((a, b) => a.stockquantity - b.stockquantity);
        setStockk(shortage);
      })
      .catch(error => {
        console.error('There was an error fetching the goods!', error);
      });
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchGoods.trim() === '') {
      // 검색어가 없으면 모든 상품을 조회
      axios.get('http://localhost:8090/traders/home')
        .then(response => {
          setGoods(response.data);
        })
        .catch(error => {
          console.error('goods상품 조회 불가', error);
        });
    } else {
      // 검색어가 있으면 해당 검색어로 상품 조회
      axios.get(`http://localhost:8090/traders/home/${searchGoods}`)
        .then(response => {
          if (response.data.length === 0) {
            alert("해당 검색어로 상품을 찾을 수 없습니다.");
          } else {
            setGoods(response.data);
          }
        })
        .catch(error => {
          console.error('goods상품 검색 불가', error);
        });
    }
  };

  const handleDateSelect = (selectedDate) => {
    // 선택한 날짜가 이전에 선택한 날짜와 다른 경우에만 실행
    if (prevSelectedDate.current && prevSelectedDate.current.getTime() === selectedDate.getTime()) {
      return;
    }
    prevSelectedDate.current = selectedDate;

    // 날짜가 어떤 형식으로 들어오는지 검증
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    axios.get(`http://localhost:8090/traders/stock?date=${formattedDate}`)
      .then(response => {
        //data가 들어오는지 검증
        // console.log("API:", response.data);

        // 선택된 날짜로부터 7일 이내에 유통기한이 끝나는 상품만 필터링
        const expiringProducts = response.data.filter(stock => {
          // console.log("date변환전 : " + JSON.stringify(stock)); 
          // stock을 콘솔로 찍었을때 object라고만 떠서 JSON.stringify로 문자열로 변환후 데이터를 확인

          // console.log("date변환전 : " + stock.expdate);
          //stock에 날짜가 expdate로 들어오고 있었음
          const expirationDate = new Date(stock.expdate); //유통기한
          // console.log("test:" + expirationDate);
          const daysDifference = (expirationDate - selectedDate) / (1000 * 60 * 60 * 24);
          //1000밀리초, 60초, 60분, 24시간 = 86,400,000 (날짜간의 차이를 계산할때 정확하게하기 위해)
          // console.log("tt:" + daysDifference);
          return daysDifference >= 0 && daysDifference <= 7;
        });
        if (expiringProducts.length > 0) {
          setStock(expiringProducts);
          // console.log(expiringProducts);
          setExpiringMessage('');
        } else {
          setStock([]);
          setExpiringMessage('7일 이내에 유통기한이 임박한 상품이 없습니다.');
        }
      })
      .catch(error => {
        console.error('There was an error fetching the stock!', error);
      });
  };

  // 개별 선택 체크
  const handleSelect = (gcode) => {
    setSelectedGoods(prevSelectedGoods =>
      prevSelectedGoods.includes(gcode)
        ? prevSelectedGoods.filter(code => code !== gcode)
        : [...prevSelectedGoods, gcode]
    );
  };

  //전체 선택 체크
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedGoods(goods.map(item => item.gcode));
    } else {
      setSelectedGoods([]);
    }
  };

  const handleOrder = () => {
    const selectedItems = goods.filter(item => selectedGoods.includes(item.gcode));
    const orderCartDTOs = selectedItems.map(item => ({
      gcount: 1, // 필요에 따라 수정, 기본 1개만 담기게 설정되어져 있음
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
        console.log('발주하기에 담기 성공:', response);
        console.log('Response data:', response.data);
        alert('발주하기에 담겼습니다.');
        setSelectedGoods([]);
      })
      .catch(error => {
        console.error('발주하기에 담기 불가', error);
      });
  };

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
                  <th style={{ width: '50px' }}>
                    <input type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedGoods.length === goods.length} /></th>
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
                    <td><input type="checkbox"
                      checked={selectedGoods.includes(goods.gcode)}
                      onChange={() => handleSelect(goods.gcode)} /></td>
                    <td>{index + 1}</td>
                    <td>{goods.gcode}</td>
                    <td>{goods.gcategory}</td>
                    <td>{goods.gname}</td>
                    <td>{goods.gcostprice.toLocaleString('ko-KR')}</td>
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
                  <th style={{ width: '12%' }}>번호</th>
                  <th style={{ width: '28%' }}>제품코드</th>
                  <th style={{ width: '35%' }}>상품명</th>
                  <th style={{ width: '25%' }}>유통기한</th>
                </tr>
              </thead>
              <tbody>
                {stock.length > 0 ? (
                  stock.map((stock, index) => (
                    <tr key={index} className={main.stockItem}>
                      <td>{index + 1}</td>
                      <td>{stock.goods.gcode}</td>
                      <td>{stock.goods.gname}</td>
                      <td>{stock.expdate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">{expiringMessage}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={main.stockList}>
            <table className={main.stockTable}>
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>번호</th>
                  <th style={{ width: '28%' }}>제품코드</th>
                  <th style={{ width: '35%' }}>상품명</th>
                  <th style={{ width: '12%' }}>수량</th>
                </tr>
              </thead>
              <tbody>
                {stockk.map((stock, index) => (
                  <tr key={index} className={main.stockItem}>
                    <td>{index + 1}</td>
                    <td>{stock.goods.gcode}</td>
                    <td>{stock.goods.gname}</td>
                    <td>{stock.stockquantity}</td>
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
