import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Receipt.module.css';
import { getAuthToken } from '../util/auth';

const Receipt = () => {
  const [receipt, setReceipt] = useState([]);
  const [originalReceipt, setOriginalReceipt] = useState([]);
  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState('');
  const [sortStates, setSortStates] = useState({
    movdate: false,
    count: false
  });

  const columns = [
    { header: '순번', accessor: null },
    { header: '입고코드', accessor: "A" },
    { header: '입고날짜', accessor: 'movdate' },
    { header: '입고건수', accessor: 'count' },
    { header: '검수상태', accessor: "A" },
    { header: '검수', accessor: null },
    { header: 'QR', accessor: null }
  ];


  useEffect(() => {
    const token = getAuthToken();
    axios.get('http://localhost:8090/traders/receipt', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setReceipt(response.data);
        setOriginalReceipt(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        const errorMessage = error.response ? error.response.data.message : '데이터를 가져오는 중 오류가 발생했습니다.';
        if (error.message.includes('CORS')) {
          alert('CORS 정책에 의해 요청이 차단되었습니다. 서버 설정을 확인하세요.');
        } else {
          alert(errorMessage);
        }
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleButtonClick = (movdate) => { //QR코드 버튼 이벤트
    console.log(`Button clicked for date ${movdate}`);
    navigate(`/qrcode?date=${movdate}`);
  };

  const handleInspectionButtonClick = (movdate) => {//검수 버튼 이벤트
    console.log(`receiptmodify clicked for date ${movdate}`);
    navigate(`/receiptmodify?movdate=${movdate}`);
  };

  const handleSortChange = (sortBy) => {
    setSortStates(prevState => {
      const newSortStates = { ...prevState, [sortBy]: !prevState[sortBy] };

      // 체크박스가 해제되면 정렬 옵션을 기본 상태로 설정
      if (!newSortStates[sortBy]) {
        setSortOption('');
      } else {
        setSortOption(sortBy);
      }

      // 한 번에 하나의 정렬만 활성화
      for (const key in newSortStates) {
        if (key !== sortBy) {
          newSortStates[key] = false;
        }
      }
      return newSortStates;
    });
  };

  const sortedReceipt = [...receipt];
  if (sortOption) {
    sortedReceipt.sort((a, b) => {
      switch (sortOption) {
        case 'movdate':
          return new Date(a.movdate) - new Date(b.movdate);
        case 'count':
          return b.count - a.count;
        default:
          return 0;
      }
    });
  }

  useEffect(() => {
    if (!sortStates.movdate && !sortStates.count) {
      setReceipt(originalReceipt);
    } else {
      setReceipt(sortedReceipt);
    }
  }, [sortStates, originalReceipt]);


  return (
    <div className={styles.rable}>
      <div className={styles.tableTop}>
        <div className={styles.tableCon}>
          <input type='checkbox' checked={sortStates.movdate} onChange={() => handleSortChange('movdate')} />
          <span>입고일자 순</span>
          <input type='checkbox' checked={sortStates.count} onChange={() => handleSortChange('count')} />
          <span>입고건수 순</span>
          <input type='checkbox' />
          <span>배송중</span>
        </div>
      </div>
      <div className={styles['receipt-table']}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {receipt.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.accessor ? row[column.accessor] : (
                      column.header === 'QR' ?
                        <button className={styles.button} onClick={() => handleButtonClick(row.movdate)}>큐알</button> :
                        column.header === '검수' ?
                          <button className={styles.button} onClick={() => handleInspectionButtonClick(row.movdate)}>검수</button> :
                          rowIndex + 1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Receipt;