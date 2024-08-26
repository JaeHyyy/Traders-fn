import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mobileInventory from './MobileInventory.module.css';
import logo from '../assets/logo.png';

const MobileInventory = () => {
    const [stockData, setStockData] = useState([]);
    const [error, setError] = useState(null);
    const branchName = localStorage.getItem('branchName'); // branchName 가져오기

    useEffect(() => {
        const urlBranchId = localStorage.getItem('branchId');

        axios.get(`http://10.10.10.25:8090/traders/stock/all-data/${urlBranchId}`)
            .then((response) => {
                const data = response.data.map(item => {
                    return {
                        branchId: urlBranchId,
                        expDate: item.expdate,
                        gcode: item.gcode,
                        gcategory: item.goodsData?.gcategory,
                        gcompany: item.goodsData?.gcompany,
                        gcostprice: item.goodsData?.gcostprice,
                        gname: item.goodsData?.gname,
                    };
                });
                setStockData(data);
            })
            .catch((error) => {
                console.error('Error fetching stock data:', error);
                setError(error.message);
            });
    }, []);

    console.log("data: ", stockData);

    return (
        <div className={mobileInventory.mobileInventory_page}>
            <img src={logo} className={mobileInventory.logo} alt="Logo" />
            <div className={mobileInventory.mobileInventory_content}>
                <div className={mobileInventory.title}>
                    <span>재고 목록</span>
                    <span className={mobileInventory.branchName}> - {branchName}</span>
                </div>
                <div className={mobileInventory.card_section}>
                    {error ? (
                        <div className={mobileInventory.error}>
                            재고 데이터를 불러오는 중 오류 발생: {error}
                        </div>
                    ) : (
                        stockData.map((item, index) => (
                            <div key={index} className={mobileInventory.card}>
                                <h3>{item.gname}</h3>
                                <p>상품코드: {item.gcode}</p>
                                <p>카테고리: {item.gcategory}</p>
                                <p>회사: {item.gcompany}</p>
                                <p>유통기한: {item.expDate}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MobileInventory;
