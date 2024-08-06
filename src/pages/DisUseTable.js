import { useState, useEffect } from 'react';
import disuse from './DisUseTable.module.css';
import axios from 'axios';

const DisUseTable = ({ columns }) => {

    const [selectedRows, setSelectedRows] = useState([]);
        // 현재 정렬 옵션을 저장하는 상태
        const [sortOption, setSortOption] = useState('');

        // 카테고리 필터 값을 저장하는 상태
        const [categoryFilter, setCategoryFilter] = useState('');
    
        // 위치 필터 값을 저장하는 상태
        const [locationFilter, setLocationFilter] = useState('');
    
        // 각 정렬 체크박스의 상태를 저장하는 상태
        const [sortStates, setSortStates] = useState({
            disdate: false,
            expiry: false,
            stock: false
        });

        const [disUseList, setDisUseList] = useState([]);

        useEffect(() => {
          axios.get('http://localhost:8090/traders/disuse')
            .then(response => {
              setDisUseList(response.data);
              console.log(response.data)
            })
            .catch(error => {
              console.error('There was an error fetching the goods!', error);
            });
        }, []);



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
            await Promise.all(selectedDisUseIds.map(disid =>
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

     // 정렬 옵션을 변경하는 함수
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

    // 필터링 및 정렬된 재고 데이터를 반환하는 함수
    const sortedAndFilteredDisuse = disUseList
        .filter(item => {
            return (categoryFilter ? item.stock.goods.gcategory === categoryFilter : true) &&
                (locationFilter ? item.stock.loc2 === locationFilter : true);
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'disdate':
                    return new Date(b.disdate) - new Date(a.disdate);
                case 'expdate':
                    return new Date(a.stock.expdate) - new Date(b.stock.expdate);
                case 'stock':
                    return b.stock.stockquantity - a.stock.stockquantity;
                default:
                    return 0;
            }
        });

    // 카테고리 필터 값을 변경하는 함수
    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    // 위치 필터 값을 변경하는 함수
    const handleLocationFilterChange = (event) => {
        setLocationFilter(event.target.value);
    };

    return (
        <div className={disuse.DisUse}>
            <div className={disuse.tableCon1}>
                <input type='checkbox' checked={sortStates.disdate} onChange={() => handleSortChange('disdate')}   />
                <span>폐기처리일 순</span>
                <input type='checkbox' checked={sortStates.expdate} onChange={() => handleSortChange('expdate')} />
                <span>유통기한 순</span>
                <input type='checkbox' checked={sortStates.stock} onChange={() => handleSortChange('stock')} />
                <span>재고량 순</span>

                <form className={disuse.cate_Form1}>
                    <select name='category' onChange={handleCategoryFilterChange} value={categoryFilter}>
                        <option  value="">카테고리</option>
                        <option>간식류</option>
                        <option>곡류</option>
                        <option>소스류</option>
                    </select>
                </form>

                <form className={disuse.cate_Form1}>
                    <select name='category'onChange={handleLocationFilterChange} value={locationFilter} >
                        <option value="">위치</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                    </select>
                </form>
            </div>
            <div className={disuse.DisUseTable}>
                <table className={disuse.custom1}>
                    <thead>
                        <tr >
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
                        {sortedAndFilteredDisuse.map((row, rowIndex) => (
                            <tr key={rowIndex} className={row.disdate ? disuse.deletedRow : ''}>
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