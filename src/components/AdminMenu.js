import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, removeAuthToken } from '../util/auth';
import 'primeicons/primeicons.css'; // PrimeReact 아이콘 CSS
import styles from './AdminMenu.module.css'; // 해당 컴포넌트에 대한 스타일
import 'primereact/resources/themes/saga-blue/theme.css'; // Primereact 테마 CSS
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // PrimeReact 아이콘 CSS


const AdminMenu = () => {
    const navigate = useNavigate();
    const token = getAuthToken();

    const handleLogout = () => {
        removeAuthToken(); // 로그아웃 시 토큰 삭제
        navigate('/login'); // 로그인 페이지로 이동
    };

    return (
        <div className={styles.menubar}>
            <div className={styles.menuitems}>
                <div className={styles.item1} onClick={() => navigate('/adminMain')}>Home</div>
                <div className={styles.item2} onClick={() => navigate('/adminGoods')}>상품 관리</div>
                <div className={styles.item3} onClick={() => navigate('/adminMovement')}>출고 관리</div>
                <div className={styles.item4} onClick={handleLogout}>
                    <i className="pi pi-sign-out" style={{ marginRight: '8px' }}></i>
                </div>
            </div>
        </div>
    );
};

export default AdminMenu;