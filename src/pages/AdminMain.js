import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminMenu from '../components/AdminMenu';
import styles from './AdminMain.module.css';
import { getAuthToken } from '../util/auth';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminMain = () => {
    const [branchStock, setBranchStock] = useState([]);
    const savedBranchId = localStorage.getItem('branchId');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        axios.get('http://localhost:8090/traders/barchart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (savedBranchId != 'admin') {
                    navigate('/');
                    alert("접근 권한이 없습니다.");
                } else {
                    setBranchStock(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const data = {
        labels: branchStock.map(item => item.branchName), // 지점 이름을 라벨로 사용
        datasets: [
            {
                label: '지점별 발주량',
                data: branchStock.map(item => item.count), // 각 지점의 재고 수량을 데이터로 사용
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <AdminMenu />
            <div className={styles.container}>

                <div className={styles.bar}> <Bar data={data} options={options} /> </div>
            </div>
        </>
    );
};

export default AdminMain;