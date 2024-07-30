import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ReceiptModify.module.css';

const ReceiptModify = () => {
    const [movements, setMovements] = useState([]);
    const [searchParams] = useSearchParams();
    const movdate = searchParams.get("movdate")

    const columns = [
        { header: '순번', accessor: null },
        { header: '상품코드', accessor: 'gcode' },
        { header: '상품명', accessor: 'gname' },
        { header: '입고수량', accessor: 'movquantity' },
        { header: '검수상태', accessor: 'movstatus' }
    ];

    useEffect(() => {
        axios.get(`http://localhost:8090/traders/receiptmodify?movdate=${movdate}`)
            .then(response => {
                setMovements(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <>
            <div>
                <table className={styles.table}>
                    <thead>
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
                                        {column.accessor ? row[column.accessor] : (rowIndex + 1)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ReceiptModify;