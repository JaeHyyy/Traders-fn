import { useState, useEffect } from 'react';
import axios from 'axios';
import stockk from './StockList.module.css';
import ReactPaginate from 'react-paginate';
import { getAuthToken } from '../util/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import api from '../util/api';
import '../App.css'


const Stock = ({ columns }) => {
    const [orderCart, setOrderCart] = useState([]);

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
        gprice: false,
        expiry: false,
        stock: false
    });

    // 현재 페이지 번호를 저장하는 상태
    const [currentPage, setCurrentPage] = useState(0);

    // 페이지당 항목 수
    const [itemsPerPage, setItemsPerPage] = useState(5); // 초기값은 5로 설정

    const navigate = useNavigate();

    const token = getAuthToken();
    const branchId = localStorage.getItem('branchId'); // 저장된 branchId 가져오기

   // 현재 페이지의 첫 번째 항목 인덱스를 계산하는 함수
    const first = currentPage * itemsPerPage;

   // 페이지당 항목 수를 rows로 할당
    const rows = itemsPerPage;

   // 페이지 변경 핸들러 함수
    const onPageChange = (event) => {
    setCurrentPage(event.page);
    setItemsPerPage(event.rows); // 페이지당 항목 수 변경 처리
    };
    //재고 통합검색
    const [searchTerm, setSearchTerm] = useState(''); // 검색어를 저장하는 상태

    

    // 서버에서 재고 데이터 가져오기
    useEffect(() => {

        if (branchId) {
            axios.get(`http://localhost:8090/traders/stock/branch/${branchId}`, {
                headers: {
                    method: "GET",
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setStock(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the goods!', error);
                });
        } else {
            console.error('No branchId found in localStorage!');
        }
    }, [branchId]);

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
                case 'gprice':
                    return b.gprice - a.gprice;
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

    //삭제하기 버튼
    const handleDeleteSelected = async () => {
        if (!branchId || !token) {
            console.error('branchId 또는 token을 찾을 수 없습니다.');
            return;
        }

        const selectedStockIds = selectedRows.map(rowIndex => stock[rowIndex].stockid);

        try {
            await Promise.all(selectedStockIds.filter(stockid => stockid !== null).map(stockid =>
                axios.delete(`http://localhost:8090/traders/stock/delete/${stockid}/${branchId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ));
            // 삭제 후 상태 업데이트
            setStock(stock.filter((_, index) => !selectedRows.includes(index)));
            setSelectedRows([]);
        } catch (error) {
            console.error("삭제 불가", error);
        }
    };


    // 추가한 useEffect: orderCart의 상태를 로깅
    useEffect(() => {
        console.log('orderCart:', orderCart); // orderCart가 제대로 로드되었는지 확인
    }, [orderCart]);

    // 발주하기 버튼
    const handleOrder = async () => {
        if (!branchId || !token) {
            console.error('branchId 또는 token을 찾을 수 없습니다.');
            return;
        }

        // 이미 orderCart에 있는 gcode들을 추출
        const existingGcodes = orderCart.map(item => item.goods.gcode);

        // 선택된 재고 항목 중 이미 orderCart에 있는 gcode가 있는지 확인
        const duplicateItems = selectedRows.filter(rowIndex =>
            existingGcodes.includes(stock[rowIndex].goods.gcode)
        );

        if (duplicateItems.length > 0) {
            alert("해당 상품은 이미 존재합니다.");
            return;
        }

        if (!stock || !orderCart || selectedRows.length === 0) {
            console.error('주문 데이터가 유효하지 않습니다.');
            return;
        }

        // 선택된 재고 항목을 OrderCartDTO 형태로 변환
        const orderCartDTOs = selectedRows.map(rowIndex => ({
            ordercode: '1234-1234-0001', // 서버에서 자동 생성되므로 null 또는 생략 가능
            gcount: 1, // gcount에 재고 수량을 할당
            goods: { // GoodsDTO 형태에 맞춰 데이터 변환
                gcode: stock[rowIndex].goods.gcode,
                goodsname: stock[rowIndex].goods.goodsname,
                price: stock[rowIndex].goods.price
            }
        }));
        try {
            // 서버에 발주 요청 전송
            const response = await axios.post(
                `http://localhost:8090/traders/ordercart/saveAll/${branchId}`,
                orderCartDTOs,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // 요청 성공 시의 처리
            console.log("Order saved successfully:", response.data);
            alert("발주가 완료되었습니다.");

        } catch (error) {
            console.error("발주 요청 실패:", error);
            alert("발주 중 오류가 발생했습니다.");
        }
    };

    // // 현재 페이지에 표시할 항목을 반환하는 함수
    const displayStock = sortedAndFilteredStock.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);



    return (
        <div className={stockk.tableTop}>
        <div className={stockk.totalTableTop}>
            <div className="p-inputgroup flex-1">
                <InputText 
                    placeholder="검색" 
                />
                <Button 
                    icon="pi pi-search" 
                    className="p-button-warning" 
                />
            </div>
            <div className={stockk.tableCon}>
                <input type='checkbox' checked={sortStates.gprice} onChange={() => handleSortChange('gprice')} />
                <span>상품판매가 순</span>
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
            </div >
        </div> 
            <div className={stockk.tableScroll}>
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
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div className={stockk.pageLine} />
            <Paginator 
            first={first} 
            rows={rows} 
            totalRecords={sortedAndFilteredStock.length} 
            rowsPerPageOptions={[5, 10, 20]} 
            onPageChange={onPageChange}
            className="my-custom-paginator" 
             />
     
            <div className={stockk.stockBtn}>
                <button className={stockk.orderStockBtn} onClick={handleOrder}>발주하기</button>
                <button className={stockk.delStockBtn} onClick={handleDeleteSelected}>삭제하기</button>
            </div>
        </div>
    );
};

export default Stock;