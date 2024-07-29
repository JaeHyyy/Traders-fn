import React from "react";
import logo from '../assets/logo.png';
import mobileMain from './MobileMain.module.css';

const MobileMain = () => {
    return (
        <div className={mobileMain.mainMobile_page}>
            <div className={mobileMain.mainMobile_box}>
                <img src={logo} alt="로고" className={mobileMain.logo} />
                <div className={mobileMain.card_box}>
                    <div className={mobileMain.card_title}>
                        {/* 카드의 타이틀 */}
                        <h6>입고내역서</h6>
                        <input type="checkbox" />
                    </div>
                    <div className={mobileMain.card_content}>
                        {/* 카드 컨텐츠 */}
                        <div className={mobileMain.card_list}>
                            {/* 카드 리스트 */}
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    A
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    B
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    C
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    D
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    E
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    F
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    G
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    H
                                </div>
                                <input type="checkbox"></input>
                            </div>
                            <div className={mobileMain.card_section}>
                                <div className={mobileMain.section_content}>
                                    I
                                </div>
                                <input type="checkbox"></input>
                            </div>
                        </div>
                    </div>
                    <div className={mobileMain.mobileLogin}>
                        <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileMain;
