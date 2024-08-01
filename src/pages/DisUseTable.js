import { useState, useEffect } from 'react';
import disuse from './DisUseTable.module.css';
import axios from 'axios';

const DisUseTable = ({ columns, disUseList=[], setDisUseList }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    //thead는 컬럼명 header
    //tbody는 데이터 accessor

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedRows(disUseList.map((_, index) => index));
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
        <div className={disuse.DisUse}>
            <div className={disuse.tableCon1}>
                <input type='checkbox'   />
                <span>판매량</span>
                <input type='checkbox'  />
                <span>유통기한 순</span>
                <input type='checkbox'  />
                <span>재고량 순</span>

                <form className={disuse.cate_Form1}>
                    <select name='category' >
                        <option disabled selected>카테고리</option>
                        <option>간식류</option>
                        <option>곡류</option>
                        <option>소스류</option>
                    </select>
                </form>

                <form className={disuse.cate_Form1}>
                    <select name='category' >
                        <option disabled selected>위치</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                    </select>
                </form>
            </div>
            <div className={disuse.DisUseTable}>
                <table className={disuse.custom1}>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedRows.length === disUseList.length}
                                />
                            </th>

                            {columns.map((column, index) => (
                                <th key={index}>{column.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {disUseList.map((row, rowIndex) => (
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
                                        {/* {row.goods && column.render ? column.render(row, rowIndex) : row[column.accessor]} */}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <div className={disuse.tableBottom1}>
                    <span className={disuse.disuseTotal}>총&nbsp;&nbsp;{disUseList.length}건</span>
                    <button className={disuse.disuseBtn}>폐기완료</button>
                    <button className={disuse.deldisuseBtn} >삭제하기</button>
            </div>
        </div>
    );
};

export default DisUseTable;