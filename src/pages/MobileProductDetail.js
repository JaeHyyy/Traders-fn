import React from "react";
import logo from '../assets/logo.png';
import product from './MobileProductDetail.module.css';

const MobileProductDetail = () => {
    return (
        <div className={product.mobileProductDetail_page}>
            <div className={product.mobileProductDetail_box}>
                <img src={logo} alt="로고" className={product.logo} />
                <div className={product.product_box}>
                    <h6>물품상세정보</h6>
                </div>
                {/* 위치정보 박스 */}
                <div className={product.product_location}>

                </div>
                {/* 상세정보 데이터 박스 */}
                <div className={product.product_information}>
                </div>
            </div>
        </div>
    );
}
export default MobileProductDetail;
