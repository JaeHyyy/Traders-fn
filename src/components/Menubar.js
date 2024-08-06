import menubar from './Menubar.module.css'
import logo from '../assets/logo.png'
import { NavLink, Outlet, useLocation, useRouteLoaderData, Form, useNavigate } from "react-router-dom";
import { getAuthToken } from '../util/auth';

function Menubar() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = getAuthToken();

    const menuItems = [
        { name: '홈', path: '/' },
        { name: '입고관리', path: '/Receipt' },
        { name: '재고관리', path: '/stock' },
        { name: '발주하기', path: '/ordercart' },
        { name: '유통기한관리', path: '/disuse' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('jwtAuthToken');
        localStorage.removeItem('branchId');
        navigate('/login');
    };

    return (
        <div className={menubar.Menubar}>

            <div className={menubar.hr}></div>
            <div className={menubar.menu_box}>
                <div className={menubar.head_box}>
                    <div className={menubar.header}>
                        <div className={menubar.header_con1}>
                            <NavLink to="/">
                                <img src={logo} alt='로고' className={menubar.logo} />
                            </NavLink>
                            <span>광안점</span>
                        </div>

                        <div className={menubar.header_con2}>
                            <span>마이페이지&nbsp;</span>
                            <span>&nbsp;|&nbsp;</span>
                            {token ? (
                                <span className={menubar.logout} onClick={handleLogout}>&nbsp;로그아웃</span>
                            ) : (
                                <NavLink to="/login" className={menubar.login}>&nbsp;로그인</NavLink>
                            )}
                        </div>
                    </div>
                </div>

                <div className={menubar.menubarr}>
                    <div className={menubar.sz_con}>
                        <div className={menubar.sz_box}>
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `${menubar.menu_sz} ${isActive ? menubar.selected : ''}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && <span className={menubar.arrow}>▶</span>}
                                            {item.name}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* <div className={menubar.sz_box}>
                        <div className={`${menubar.menu_sz} ${menubar.sz_color}`}>
                            홈
                        </div>
                        <div className={menubar.menu_sz}>입고관리</div>
                        <div className={menubar.menu_sz}>재고관리</div>
                        <div className={menubar.menu_sz}>발주하기</div>
                        <div className={menubar.menu_sz}>유통기한관리</div>
                        </div> */}

                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Menubar;