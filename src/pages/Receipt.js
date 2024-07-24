import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Receipt=() => {
  const [movement, setMovement] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    { header: '순번', accessor: null },
    { header: '입고코드', accessor: null},
    { header: '입고날짜', accessor: 'movdate' },
    { header: '입고건수', accessor: 'count' },
    { header: '검수상태', accessor: null},
    { header: '검수', accessor: null}
   ];


    useEffect(() => {
      axios.get('http://localhost:8090/traders/receipt')
        .then(response => {
          setMovement(response.data);
        })
        .catch(error => {
          console.error('돌아가. 뭔가 잘못되었다.', error);
        });
    }, []);

    const handleSelectAll = (event) => {
      if (event.target.checked) {
        setSelectedRows(movement.map((_, index) => index));
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
      <table className="receipt-table">
        <thead>
          <tr>
            <th></th>
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={selectedRows.length === movement.length}
            />
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>))}
          </tr>
        </thead>
        <tbody>
          {movement.map((row, rowIndex) =>(
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
                    {column.render ? column.render(row) : row[column.accessor]}
                      {/* render는 이미지나 입력필드 같은 특수한 데이터
                 accessor는 데이터 키값 */}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
};

export default Receipt;