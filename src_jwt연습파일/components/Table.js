import { useState } from 'react';
import './Table.css';

const Table = ({ columns, data }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    //thead는 컬럼명 header
    //tbody는 데이터 accessor

    const handleSelectAll = (event) => {
        if (event.target.checked) {
          setSelectedRows(data.map((_, index) => index));
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
        <table className="custom-table">
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === data.length}
                        />
                    </th>

                    {columns.map((column, index) => (
                        <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
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

export default Table;