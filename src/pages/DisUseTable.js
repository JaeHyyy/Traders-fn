import { useState, useEffect } from 'react';
import disuse from './DisUseTable.module.css';
import axios from 'axios';

const DisUseTable = ({ columns, disUseList=[], setDisUseList }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [deletedRows, setDeletedRows] = useState([]);


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

        // 폐기완료
        const handleCompleteSelected = async () => {
            const selectedDisUseIds = selectedRows.map(rowIndex => disUseList[rowIndex].disid);
    
            try {
                // DisUse 업데이트
                await Promise.all(selectedDisUseIds.map(disid =>         //Date 객체를 ISO 8601 형식의 문자열로 변환  [0]으로 날짜 부분만 반환
                    axios.put(`http://localhost:8090/traders/disuse/update/${disid}`, { disdate: new Date().toISOString().split('T')[0] })
                ));
    
                // 업데이트 후 상태 업데이트
                setDisUseList(disUseList.map((item, index) => 
                    selectedRows.includes(index) ? { ...item, disdate: new Date().toISOString().split('T')[0] } : item
                ));
                setSelectedRows([]);
                
            } catch (error) {
                console.error("폐기완료 실패", error);
            }
        };
   
    //유통기한관리 페이지 삭제하기 버튼(stock & disuse 테이블 db데이터 동시 삭제)
    const handleDeleteSelected = async () => {
        const selectedDisUseIds = selectedRows.map(rowIndex => disUseList[rowIndex].disid);
        const selectedStockIds = selectedRows.map(rowIndex => disUseList[rowIndex].stock?.stockid);

        try {
            // DisUse 삭제
            await Promise.all(selectedDisUseIds.map(disid => axios.delete(`http://localhost:8090/traders/disuse/delete/${disid}`)));
            // Stock 삭제
            await Promise.all(selectedStockIds.filter(stockid => stockid !== null).map(stockid => axios.delete(`http://localhost:8090/traders/stock/delete/${stockid}`)));

            // 삭제 후 상태 업데이트
            setDisUseList(disUseList.filter((_, index) => !selectedRows.includes(index)));
            setSelectedRows([]);
        } catch (error) {
            console.error("삭제불가", error);
        }
    };

    return (
        <div className={disuse.DisUse}>
            <div className={disuse.tableCon1}>
                <input type='checkbox'   />
                <span>폐기처리일 순</span>
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
                    <button className={disuse.disuseBtn} onClick={handleCompleteSelected} >폐기완료</button>
                    <button className={disuse.deldisuseBtn} onClick={handleDeleteSelected}>삭제하기</button>
            </div>
        </div>
    );
};

export default DisUseTable;