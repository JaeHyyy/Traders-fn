import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ReceiptModify.module.css';
import get from 'lodash/get';

const ReceiptModify = () => {
    const [movements, setMovements] = useState([]);
    const [searchParams] = useSearchParams();
    const movdate = searchParams.get("movdate");
    const [selectedGcode, setSelectedGcode] = useState(null);
    const [locations, setLocations] = useState({ loc1: '', loc2: '', loc3: '' });

    const columns = [
        { header: '순번', accessor: null, className: styles['column-seq'] },
        { header: '상품코드', accessor: 'goods.gcode', className: styles['column-gcode'] },
        { header: '상품명', accessor: 'goods.gname', className: styles['column-gname'] },
        { header: '제조사', accessor: 'goods.gcompany', className: styles['column-gcompany'] },
        { header: '수량', accessor: 'movement.movquantity', className: styles['column-movquantity'] },
        { header: '단위', accessor: 'goods.gunit', className: styles['column-gunit'] },
        { header: '총액', accessor: 'goods.gcostprice', className: styles['column-gcostprice'] },
        { header: '검수상태', accessor: 'movement.movstatus', className: styles['column-movstatus'] },
        { header: '위치', accessor: null, className: styles['column-location'] }
    ];

    useEffect(() => { //날짜로 분류된 데이터 조회
        axios.get(`http://localhost:8090/traders/join?movdate=${movdate}`)
            .then(response => {
                console.log('API Response:', response.data);
                setMovements(response.data);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [movdate]);


    const handleEditClick = async (gcode) => {
        setSelectedGcode(gcode);
        try {
            const response = await axios.get('http://localhost:8090/traders/getLocation', {
                params: { gcode }
            });
            if (response.data.length > 0) {
                const { loc1, loc2, loc3 } = response.data[0];
                setLocations({
                    loc1: loc1 || '',
                    loc2: loc2 || '',
                    loc3: loc3 || ''
                });
                console.log(`Editing gcode: ${gcode}, loc1: ${loc1}, loc2: ${loc2}, loc3: ${loc3}`);
            } else {
                alert('중복된 재고가 있습니다! 재고 관리 페이지를 통해 확인해주세요.');
            }
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocations(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {//위치 update 기능
        e.preventDefault();
        try {
            await axios.put('http://localhost:8090/traders/updateLocation', null, {
                params: {
                    gcode: selectedGcode,
                    loc1: locations.loc1,
                    loc2: locations.loc2,
                    loc3: locations.loc3
                }
            });
            alert('Location updated successfully');
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };


    return (
        <div className={styles.rable}>
            <div className={styles["table-container"]}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.accessor ? (
                                            column.accessor === 'goods.gcostprice' ? (
                                                // 연산 예시: 총액 (gcostprice * movquantity)
                                                get(row, 'goods.gcostprice') * get(row, 'movement.movquantity')
                                            ) : (
                                                get(row, column.accessor)
                                            )
                                        ) : (
                                            column.header === '위치' ? (
                                                <button className={styles.tbutton} onClick={() => handleEditClick(row.goods.gcode)}>수정 </button>
                                            ) : (rowIndex + 1)
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.add}>
                <form onSubmit={handleSubmit}>
                    <h2>위치 정보</h2>
                    <p className={styles.selectedcode}>{selectedGcode ? selectedGcode : '상품 위치를 추가해주세요'}</p>
                    <div><label>위치1 : <input
                        type="text"
                        name="loc1"
                        value={locations.loc1}
                        onChange={handleChange}
                    /></label></div>
                    <div><label>위치2 : <input
                        type="text"
                        name="loc2"
                        value={locations.loc2}
                        onChange={handleChange}
                    /></label></div>
                    <div><label>위치3 : <input
                        type="text"
                        name="loc3"
                        value={locations.loc3}
                        onChange={handleChange}
                    /></label></div>
                    <button type="submit">제출</button>
                </form>
            </div>

        </div>
    );
};

export default ReceiptModify;