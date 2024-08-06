import { useState, useEffect } from 'react';
import axios from 'axios';
import stockk from './StockList.module.css';
import ReactPaginate from 'react-paginate';

const Stock = ({ columns }) => {
    // 선택된 행의 인덱스를 저장하는 상태
    const [selectedRows, setSelectedRows] = useState([]);

    // 서버에서 가져온 재고 데이터를 저장하는 상태
    const [stock, setStock] = useState([]);

    // 현재 정렬 옵션을 저장하는 상태
    const [sortOption, setSortOption] = useState('');

    // 카테고리 필터 값을 저장하는 상태
    const [categoryFilter, setCategoryFilter] = useState('');

    // 위치 필터 값을 저장하는 상태
    const [locationFilter, setLocationFilter] = useState('');

    // 각 정렬 체크박스의 상태를 저장하는 상태
    const [sortStates, setSortStates] = useState({
        quantity: false,
        expiry: false,
        stock: false
    });

    // 현재 페이지 번호를 저장하는 상태
    const [currentPage, setCurrentPage] = useState(0);

    // 페이지당 항목 수
    const itemsPerPage = 7;


    //thead는 컬럼명 header
    //tbody는 데이터 accessor

    // 서버에서 재고 데이터 가져오기
    useEffect(() => {
        axios.get('http://localhost:8090/traders/stock')
            .then(response => {
                setStock(response.data);
                // console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the goods!', error);
            });
    }, []);

    // 모든 행을 선택하거나 선택을 해제하는 함수
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedRows(stock.map((_, index) => index));
        } else {
            setSelectedRows([]);
        }
    };

    // 특정 행을 선택하거나 선택을 해제하는 함수
    const handleSelectRow = (rowIndex) => {
        if (selectedRows.includes(rowIndex)) {
            setSelectedRows(selectedRows.filter(index => index !== rowIndex));
        } else {
            setSelectedRows([...selectedRows, rowIndex]);
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
    const sortedAndFilteredStock = stock
        .filter(item => {
            return (categoryFilter ? item.goods.gcategory === categoryFilter : true) &&
                (locationFilter ? item.loc2 === locationFilter : true);
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'quantity':
                    return b.stockquantity - a.stockquantity;
                case 'expiry':
                    return new Date(a.expdate) - new Date(b.expdate);
                case 'stock':
                    return b.stockquantity - a.stockquantity;
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

    //페이지네이션
    // 현재 페이지에 표시할 항목을 반환하는 함수
    const displayStock = sortedAndFilteredStock.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // 총 페이지 수를 계산하는 함수
    const pageCount = Math.ceil(sortedAndFilteredStock.length / itemsPerPage);

    // 페이지를 변경하는 함수
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className={stockk.tableTop}>
            <div className={stockk.tableCon}>
                <input type='checkbox' checked={sortStates.quantity} onChange={() => handleSortChange('quantity')} />
                <span>판매량</span>
                <input type='checkbox' checked={sortStates.expiry} onChange={() => handleSortChange('expiry')} />
                <span>유통기한 순</span>
                <input type='checkbox' checked={sortStates.stock} onChange={() => handleSortChange('stock')} />
                <span>재고량 순</span>

                <form className={stockk.cate_Form}>
                    <select name='category' onChange={handleCategoryFilterChange} value={categoryFilter}>
                        <option value="">카테고리</option>
                        <option>간식류</option>
                        <option>곡류</option>
                        <option>소스류</option>
                    </select>
                </form>

                <form className={stockk.cate_Form}>
                    <select name='category' onChange={handleLocationFilterChange} value={locationFilter}>
                        <option value="">위치</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                    </select>
                </form>
            </div>
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
                    {displayStock.map((row, rowIndex) => (
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
                    {displayStock.length < itemsPerPage &&
                        Array.from({ length: itemsPerPage - displayStock.length }).map((_, index) => (
                            <tr key={`empty-${index}`}>
                                <td colSpan={columns.length + 1}>&nbsp;</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <hr className={stockk.pageLine} />
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
                className={stockk.page}
            />
            <div className={stockk.stockBtn}>
                <button>발주하기</button>
                <button>삭제하기</button>
            </div>
        </div>
    );
};

export default Stock;