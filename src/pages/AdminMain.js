import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../util/api';
import AdminMenu from '../components/AdminMenu';
import styles from './AdminMain.module.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import 'chart.js/auto';

const AdminMain = () => {
    const [branchStock, setBranchStock] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [typingText, setTypingText] = useState('');
    const savedBranchId = localStorage.getItem('branchId');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/traders/barchart')
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

        api.get('/traders/chart2')
            .then(response => {
                const topProducts = response.data.slice(0, 10);
                setPopularProducts(topProducts);
            })
            .catch(error => {
                console.error('Error fetching popular products:', error);
            });
    }, []);




    const branchData = {
        labels: branchStock.map(item => item.branchName), // 지점 이름을 라벨로 사용
        datasets: [
            {
                label: '지점별 발주량',
                data: branchStock.map(item => item.count), // 각 지점의 재고 수량을 데이터로 사용
                backgroundColor: [
                    'rgba(54, 162, 135, 0.6)',
                    'rgba(54, 162, 135, 0.2)',
                    'rgba(54, 162, 135, 0.4)',
                ],
                borderColor: [
                    'rgba(54, 162, 135, 1)',
                    'rgba(54, 162, 135, 1)',
                    'rgba(54, 162, 135, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const productData = {
        labels: popularProducts.map(item => item.gname),
        datasets: [
            {
                label: '인기 상품 순위',
                data: popularProducts.map(item => item.summ),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.4)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 135, 0.2)',
                    'rgba(54, 162, 135, 0.4)',
                    'rgba(54, 162, 135, 0.6)',
                    'rgba(54, 162, 135, 0.8)',
                    'rgba(54, 162, 135, 1)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 135, 1)',
                    'rgba(54, 162, 135, 1)',
                    'rgba(54, 162, 135, 1)',
                    'rgba(54, 162, 135, 1)',
                    'rgba(54, 162, 135, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const productOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right', // 범례를 오른쪽에 배치
                align: 'center', // 범례를 중앙에 정렬
                labels: {
                    boxWidth: 10, // 범례 상자의 너비 조절
                    padding: 10,  // 범례 간격 조절
                },
            },
            title: {
                display: true,
                text: 'TOP 10!', // 제목 설정
                font: {
                    size: 20,
                },
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
        },
        maintainAspectRatio: false, // 캔버스 크기 비율 유지 설정
    };


    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    useEffect(() => {
        const text = " 반갑습니다, 관리자님! ";
        setTypingText(''); // 상태 초기화

        const timeouts = []; // 타임아웃 ID를 저장할 배열

        for (let i = 0; i < text.length; i++) {
            const timeoutId = setTimeout(() => {
                setTypingText(prev => prev + text[i]);
            }, i * 150); // 각 문자가 150ms 간격으로 타이핑되도록 설정

            timeouts.push(timeoutId); // 타임아웃 ID 저장
        }

        return () => {
            // 컴포넌트 언마운트 시 모든 타임아웃 정리
            timeouts.forEach(clearTimeout);
        };
    }, []);


    //tetxbox 이벤트 설정할것! 아직 아무것도 없음.
    const handleSubmit = () => {
        // 입력된 내용을 기반으로 이벤트를 수행하는 로직
        console.log('Submitted:', inputValue);
        // 예: 서버로 요청 보내기 또는 다른 작업 수행
    };

    return (
        <>
            <AdminMenu />
            <div className={styles.container}>
                <Card className={styles.card} title={typingText}>
                    <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                    </p>
                </Card>
                <div className={styles.floatLabelContainer}>
                    <FloatLabel>
                        <InputTextarea id="description" value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} className={styles.inputTextarea} />
                        <label htmlFor="description">Add Promotion</label>
                    </FloatLabel>
                    <Button label="Send" raised className={styles.customButton} onClick={handleSubmit} />
                </div>
            </div>
            <div className={styles.chartContainer}>
                <div className={styles.bar}><Bar data={branchData} options={options} /></div>
                <div className={styles.doughnut}><Doughnut data={productData} options={productOptions} /></div>
            </div>
        </>
    );
};

export default AdminMain;