import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Receipt.module.css';

const Receipt=() => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { header: '순번', accessor: null },
    { header: '입고코드', accessor: null},
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

    return (
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
    );
};

export default Receipt;