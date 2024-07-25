import { useState, useEffect } from 'react';
import axios from 'axios';
import stockk from './StockList.module.css';

const Stock = ({ columns }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [stock, setStock] = useState([]);

    //thead는 컬럼명 header
    //tbody는 데이터 accessor

    useEffect(() => {
        axios.get('http://localhost:8090/traders/stock')
          .then(response => {
            setStock(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the goods!', error);
          });
      }, []);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
          setSelectedRows(stock.map((_, index) => index));
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
        <table className={stockk.stockT}>
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === stock.length}
                        />
                    </th>

                    {columns.map((column, index) => (
                        <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {stock.map((row, rowIndex) => (
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

export default Stock;