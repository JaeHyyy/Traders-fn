import './Menubar.css'
import logo from '../assets/logo.png'
import { Outlet } from "react-router-dom";
function Menubar() {
    return (
        <div className="Menubar">

            <div className='hr'></div>
            <div className='menu_box'>
                <div className='head_box'>
                    <div className='header'>
                        <div className='header_con1'>
                            <img src={logo} alt='로고' className='logoo' />
                            <span>광안점</span>
                        </div>

                        <div className='header_con2'>
                            <span>마이페이지&nbsp;</span>
                            <span>&nbsp;|&nbsp;</span>
                            <span className='logout'>&nbsp;로그아웃</span>
                        </div>
                    </div>
                </div>

                <div className='menubarr'>
                    <div className='sz_box'>
                        <div className='menu_sz sz_color'>
                            <div>홈</div>
                        </div>
                        <div className='menu_sz'>입고관리</div>
                        <div className='menu_sz'>재고관리</div>
                        <div className='menu_sz'>발주하기</div>
                        <div className='menu_sz'>유통기한관리</div>
                    </div>

                    <main className='main_con'>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Menubar;