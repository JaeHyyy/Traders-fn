import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../util/api';
import AdminMenu from '../components/AdminMenu';
import styles from './AdminMain.module.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import 'chart.js/auto';

const AdminMain = () => {
    const [branchStock, setBranchStock] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [typingText, setTypingText] = useState('');
    const [content, setContent] = useState('');
    const [branches, setBranches] = useState([]); // 드롭다운 지점
    const [selectedBranch, setSelectedBranch] = useState(null); //드롭다운 지점 선택상태
    const savedBranchId = localStorage.getItem('branchId'); // admin 권한 검증용
    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        if (savedBranchId != 'admin') {
            navigate('/');
            alert("접근 권한이 없습니다.");
        }

        // 지점 데이터를 가져오는 API 호출
        api.get('/traders/sendbranch')
            .then(response => {
                const branchData = response.data;
                const allBranchOption = { branchId: null, branchName: '전체' }; // 기본 전체 옵션
                setBranches([allBranchOption, ...branchData]);
                setSelectedBranch(allBranchOption); // 기본으로 전체가 선택되도록 설정
            })
            .catch(error => {
                console.error('Error fetching branch data:', error);
            });

        api.get('/traders/barchart')
            .then(response => {
                setBranchStock(response.data);
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


    //메세지 전송
    const sendNotice = () => {
        const noticeData = {
            content: content, // content가 없으면 null로 설정
            isGlobal: selectedBranch?.branchId === null, // 전체 공지 여부
            noticedate: null,// 현재 날짜를 YYYY-MM-DD 형식으로 설정
            user: { branchId: selectedBranch?.branchId || savedBranchId },
        };
        api.post('/traders/sendnotice', noticeData)
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Notice sent successfully', life: 3000 });
                setContent('');
                setSelectedBranch(null);
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to send notice', life: 3000 });
                console.error('Error sending message:', error);
            });
    };

    // 공지 발송 재확인
    const confirmSendNotice = () => {
        confirmDialog({
            message: '정말로 공지를 보내시겠습니까?',
            header: '공지 전송 확인',
            icon: 'pi pi-exclamation-triangle',
            accept: sendNotice, // "예"를 선택하면 sendNotice 함수 실행
            reject: () => {
                toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'Notice sending cancelled', life: 3000 });
            },
        });
    };

    return (
        <>
            <AdminMenu />
            <Toast ref={toast} />
            <ConfirmDialog className={styles.confirmDialog} />
            <div className={styles.container}>
                <Card className={styles.card} title={typingText}>
                    <p className="m-0">
                        "Management is doing things right; leadership is doing the right things."
                        -Peter Drucker-
                    </p>
                </Card>
                <div className={styles.floatLabelContainer}>
                    <FloatLabel>
                        <InputTextarea id="description" value={content} onChange={(e) => setContent(e.target.value)} rows={5} cols={30} className={styles.inputTextarea} />
                        <label htmlFor="description">notice</label>
                    </FloatLabel>
                    <div className={styles.actionContainer}>
                        <Dropdown
                            value={selectedBranch}
                            options={branches}
                            onChange={(e) => setSelectedBranch(e.value)}
                            optionLabel="branchName"
                            placeholder="지점을 선택하세요"
                            className={styles.dropdown}
                        />
                        <Button label="Send" raised className={styles.customButton} onClick={confirmSendNotice} />
                    </div>
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