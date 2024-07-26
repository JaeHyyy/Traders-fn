import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Receipt.module.css';

const Receipt=() => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  const columns = [
    { header: '순번', accessor: null },
    { header: '입고코드', accessor: "대기"},
    { header: '입고날짜', accessor: 'movdate' },
    { header: '입고건수', accessor: 'count' },
    { header: '검수상태', accessor: "대기"},
    { header: '검수', accessor: null}
   ];


   useEffect(() => {
    axios.get('http://localhost:8090/traders/receipt')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleButtonClick = (rowIndex) => {
    console.log(`Button clicked in row ${rowIndex}`);
    navigate('/qrcode');
  };

  useEffect(() => {
    let sortedData = [...data];
    if (checkbox1) {
      sortedData = sortedData.sort((a, b) => new Date(a.movdate) - new Date(b.movdate));
    } else if (checkbox3) {
      sortedData = sortedData.sort((a, b) => b.count - a.count);
    } else {
      axios.get('http://localhost:8090/traders/receipt')
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    setData(sortedData);
  }, [checkbox1, checkbox3]);

    return (
      <>
      <div className={styles['checkbox-container']}>
        <input
          type="checkbox"
          id="checkbox1"
          className={styles.checkbox}
          checked={checkbox1}
          onChange={(e) => setCheckbox1(e.target.checked)}
        />
        <label htmlFor="checkbox1" className={styles['checkbox-label']}>입고일자</label>

        <input
          type="checkbox"
          id="checkbox2"
          className={styles.checkbox}
          checked={checkbox2}
          onChange={(e) => setCheckbox2(e.target.checked)}
        />
        <label htmlFor="checkbox2" className={styles['checkbox-label']}>검수 대기중</label>

        <input
          type="checkbox"
          id="checkbox3"
          className={styles.checkbox}
          checked={checkbox3}
          onChange={(e) => setCheckbox3(e.target.checked)}
        />
        <label htmlFor="checkbox3" className={styles['checkbox-label']}>입고건수</label>
      </div>
      <div>
      <table className = {styles['receipt-table']}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>
                {column.accessor ? row[column.accessor] : (column.header === '검수' ? 
                <button className={styles.button} onClick={() => handleButtonClick(rowIndex)}>검수</button> : rowIndex + 1)}
              </td>
            ))}
            </tr>
        ))}       
      </tbody>
    </table>
      </div>
      </>
    );
};

export default Receipt;