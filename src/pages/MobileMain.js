import React from 'react';
import { useNavigate } from 'react-router-dom';
import mobileMain from './MobileMain.module.css';
import logo from '../assets/logo.png';
import statement from '../assets/statement.png';
import warehouse from '../assets/warehouse.png';
import reject from '../assets/rejected-file.png';

const MobileMain = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const urlBranchId = localStorage.getItem('branchId');
    const urlDate = searchParams.get('date');

    console.log("urlBranchId: ", urlBranchId);
    console.log("urlDate: ", urlDate);

    const handleReceiveButtonClick = () => {
        if (!urlDate) {
            alert("금일 입고된 상품이 없습니다");
        } else {
            navigate(`/mobile/receive?branchId=${urlBranchId}&date=${urlDate}`);
        }
    };

    const handleStockButtonClick = () => {
        navigate(`/mobile/inventory?branchId=${urlBranchId}&date=${urlDate}`);
    };

    const handleRejectButtonClick = () => {
        navigate(`/mobile/reject?branchId=${urlBranchId}&date=${urlDate}`);
    };

    return (
        <div className={mobileMain.mobileMain_page}>
            <div className={mobileMain.mobileMain_content}>
                <img src={logo} alt='로고' className={mobileMain.logo} />
                <div className={mobileMain.button_container}>
                    <button className={mobileMain.btn_select_stock} onClick={handleStockButtonClick}>
                        <img src={warehouse} alt="재고확인 아이콘" className={mobileMain.btn_icon} />
                        <span>재고확인</span>
                    </button>
                    <button className={mobileMain.btn_select_receive} onClick={handleReceiveButtonClick}>
                        <img src={statement} alt="입고내역 아이콘" className={mobileMain.btn_icon} />
                        <span>입고내역</span>
                    </button>
                    <button className={mobileMain.btn_select_reject} onClick={handleRejectButtonClick}>
                        <img src={reject} alt="반려 아이콘" className={mobileMain.btn_icon} />
                        <span>반려하기</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileMain;
