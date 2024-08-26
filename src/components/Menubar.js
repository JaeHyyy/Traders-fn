import React, { useRef, useState, useEffect } from 'react';
import menubar from './Menubar.module.css'
import logo from '../assets/logo.png'
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from '../util/auth';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import api from '../util/api';


function Menubar() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = getAuthToken();
    const branchName = localStorage.getItem('branchName');
    const branchId = localStorage.getItem('branchId');
    const op = useRef(null);
    const [notices, setNotices] = useState([]);
    const [badgeCount, setBadgeCount] = useState(0);
    const [global, setGlobal] = useState({
        content: '', // content가 없으면 null로 설정
        isGlobal: '', // 전체 공지 여부
        noticedate: '',// 현재 날짜를 YYYY-MM-DD 형식으로 설정
        branchId: '',
    });

    const menuItems = [
        { name: '홈', path: '/' },
        { name: '재고관리', path: '/stock' },
        { name: '발주하기', path: '/ordercart' },
        { name: '입고관리', path: '/Receipt' },
        { name: '유통기한관리', path: '/disuse' }
    ];

    //공지사항 가져오기
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const [globalResponse, branchResponse] = await Promise.all([
                    api.get('/traders/globalnotice'),
                    api.get(`/traders/getnotice/${branchId}`)
                ]);
                const combinedNotices = [...globalResponse.data, ...branchResponse.data];
                setNotices(combinedNotices);
                setBadgeCount(combinedNotices.length);
            } catch (error) {
                console.error('Error fetching notices:', error);
            }
        };
        fetchNotices();
    }, [branchId]);




    const handleLogout = () => {
        localStorage.removeItem('jwtAuthToken');
        localStorage.removeItem('branchId');
        localStorage.removeItem('branchName');
        navigate('/login');
    };

    const handleMypage = () => {
        navigate('/mypage');
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
                            <span>{branchName || '지점명'}</span>
                        </div>

                        <div className={menubar.header_con2}>
                            <span type="button" className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.4rem', cursor: 'pointer' }} onClick={(e) => op.current.toggle(e)}>
                                <Badge value={badgeCount} style={{ backgroundColor: '#aada2a', cursor: 'pointer' }} ></Badge>
                                <OverlayPanel ref={op}>
                                    <div> <br /> <h3> &nbsp;&nbsp; 공지사항 </h3> <br />
                                        {notices.length > 0 ? (
                                            notices.map((notice, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        padding: '10px',
                                                        borderBottom: '1px solid #ddd',
                                                        backgroundColor: notice.isGlobal ? '#f0f0f0' : 'white',
                                                        padding: '20px',
                                                        margin: '10px',
                                                    }}
                                                >
                                                    <strong>{notice.noticedate}</strong> - {notice.content}
                                                </div>
                                            ))
                                        ) : (
                                            <div>공지사항이 없습니다.</div>
                                        )}
                                    </div>
                                </OverlayPanel>
                            </span>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;</span>
                            <span className={menubar.mypage} onClick={handleMypage}>마이페이지&nbsp;</span>
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
        </div >
    );
}

export default Menubar;