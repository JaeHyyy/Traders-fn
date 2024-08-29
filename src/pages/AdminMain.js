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
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import 'chart.js/auto';
import 'chartjs-plugin-datalabels';

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
    const [notices, setNotices] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (savedBranchId != 'admin@traders.com') {
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
                    'rgba(37, 92, 105, 0.9)',    // 어두운 청록색
                    'rgba(42, 127, 98, 0.9)',    // 어두운 녹색
                    'rgba(62, 160, 90, 0.9)',    // 중간 녹색
                    'rgba(78, 181, 161, 0.7)',   // 중간 청록색
                    'rgba(87, 201, 158, 0.7)',   // 밝은 녹색
                    'rgba(100, 210, 177, 0.7)',  // 밝은 민트색
                    'rgba(107, 227, 204, 0.6)',  // 밝은 아쿠아색
                    'rgba(121, 241, 230, 0.6)',  // 매우 밝은 청록색
                    'rgba(160, 216, 182, 0.6)',  // 밝은 연두색
                    'rgba(208, 232, 194, 0.6)',  // 밝은 올리브색
                ],
                borderColor: [
                    'rgba(37, 92, 105, 1)',    // 어두운 청록색
                    'rgba(42, 127, 98, 1)',    // 어두운 녹색
                    'rgba(62, 160, 90, 1)',    // 중간 녹색
                    'rgba(78, 181, 161, 1)',   // 중간 청록색
                    'rgba(87, 201, 158, 1)',   // 밝은 녹색
                    'rgba(100, 210, 177, 1)',  // 밝은 민트색
                    'rgba(107, 227, 204, 1)',  // 밝은 아쿠아색
                    'rgba(121, 241, 230, 1)',  // 매우 밝은 청록색
                    'rgba(160, 216, 182, 1)',  // 밝은 연두색
                    'rgba(208, 232, 194, 1)',  // 밝은 올리브색
                ],
                borderWidth: 1,
            },
        ],
    };

    const productData = {
        labels: popularProducts.map(item => item.gname),
        datasets: [
            {
                label: '총 재고량',
                data: popularProducts.map(item => item.summ),
                backgroundColor: [
                    'rgba(37, 92, 105, 0.9)',    // 어두운 청록색
                    'rgba(42, 127, 98, 0.9)',    // 어두운 녹색
                    'rgba(62, 160, 90, 0.9)',    // 중간 녹색
                    'rgba(78, 181, 161, 0.7)',   // 중간 청록색
                    'rgba(87, 201, 158, 0.7)',   // 밝은 녹색
                    'rgba(100, 210, 177, 0.7)',  // 밝은 민트색
                    'rgba(107, 227, 204, 0.6)',  // 밝은 아쿠아색
                    'rgba(121, 241, 230, 0.6)',  // 매우 밝은 청록색
                    'rgba(160, 216, 182, 0.6)',  // 밝은 연두색
                    'rgba(208, 232, 194, 0.6)',  // 밝은 올리브색
                ],
                borderColor: [
                    'rgba(37, 92, 105, 1)',    // 어두운 청록색
                    'rgba(42, 127, 98, 1)',    // 어두운 녹색
                    'rgba(62, 160, 90, 1)',    // 중간 녹색
                    'rgba(78, 181, 161, 1)',   // 중간 청록색
                    'rgba(87, 201, 158, 1)',   // 밝은 녹색
                    'rgba(100, 210, 177, 1)',  // 밝은 민트색
                    'rgba(107, 227, 204, 1)',  // 밝은 아쿠아색
                    'rgba(121, 241, 230, 1)',  // 매우 밝은 청록색
                    'rgba(160, 216, 182, 1)',  // 밝은 연두색
                    'rgba(208, 232, 194, 1)',  // 밝은 올리브색
                ],
                borderWidth: 1,




            },
        ],
    };


    const productOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
                align: 'center',
                labels: {
                    boxWidth: 10,
                    padding: 10,
                },
            },
            title: {
                display: true,
                text: '인기 상품 BEST 10',
                font: {
                    size: 20,
                },
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
            datalabels: {
                display: true,
                color: '#4C4C4C', // 텍스트 색상
                font: {
                    weight: 'bold',
                    size: 14,
                },
                formatter: (value, context) => {
                    const total = context.chart._metasets[context.datasetIndex].total;
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${context.chart.data.labels[context.dataIndex]}\n${percentage}%`; // 상품명과 비율을 함께 표시
                },
                anchor: 'end',    // 라벨 위치를 끝에 고정
                align: 'start',   // 라벨 텍스트 정렬
                offset: -10,      // 라벨을 도넛 안쪽으로 밀어 넣기
            }
        },
        maintainAspectRatio: false, // 캔버스 크기 비율 유지 설정
    };


    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value + ' 개';
                    }
                }
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
            acceptClassName: 'p-button-text p-button-plain custom-accept-button', // 커스텀 스타일 적용
            rejectClassName: 'p-button-text p-button-plain custom-reject-button', // 커스텀 스타일 적용
            acceptLabel: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="pi pi-check" style={{ fontSize: '16px', marginRight: '5px' }}></i>예
                </span>
            ),
            rejectLabel: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="pi pi-times" style={{ fontSize: '16px', marginRight: '5px' }}></i>아니오
                </span>
            ),
            accept: sendNotice,
            reject: () => {
                console.log('Notice sending cancelled');
            },
        });
    };

    const handleButtonClick = (url) => {
        window.open(url, '_blank');
    };

    //공지 목록
    useEffect(() => {
        api.get('/traders/notices')
            .then(response => setNotices(response.data))
            .catch(error => console.error('Error fetching notices:', error));
    }, []);

    //공지 삭제
    const handleDelete = (noticeId) => {
        api.delete(`/traders/deletenotice/${noticeId}`)
            .then(() => {
                setNotices(notices.filter(notice => notice.noticeId !== noticeId));
            })
            .catch(error => {
                console.error('Error deleting notice:', error);
            });
    };

    //공지 각 행의 삭제 아이콘 ㅎㅎ
    const actionBodyTemplate = (rowData) => {
        return (
            <Button icon="pi pi-times" className={styles.b} onClick={() => handleDelete(rowData.noticeId)} />
        );
    };

    return (
        <>
            <AdminMenu />
            <Toast ref={toast} />
            <ConfirmDialog className={styles.confirmDialog} />
            <div className={styles.container}>
                <Card className={styles.card} title={typingText}>

                    <Divider />
                    <p className={styles.welcomeText}>
                        안녕하세요, 이마트트레이더스 본사 관리 시스템에 오신 것을 환영합니다.
                        <br /><br />
                        본 시스템은 지점 운영과 고객 만족도를 극대화하기 위한 핵심 도구입니다. 데이터를 정확히 관리하고 신속하게 의사결정하는 데 도움을 줍니다.
                        <br /><br />
                        문제가 발생하면 해당 부서에 문의해주시기 바랍니다. 여러분의 노고에 깊이 감사드립니다.
                    </p>




                    {/* <div className={styles.buttons}>
                        <button
                            className={styles.linkbutton1}
                            onClick={() => handleButtonClick('http://www.traders.co.kr/index.jsp')}
                        >
                            Traders
                        </button>
                        <button
                            className={styles.linkbutton2}
                            onClick={() => handleButtonClick('https://www.instagram.com/traders_wholesale_club/')}
                        >
                            <i className="pi pi-instagram"></i>
                        </button>
                        <button
                            className={styles.linkbutton3}
                            onClick={() => handleButtonClick('https://www.sikorea.co.kr/company/group')}
                        >
                            SSG
                        </button>
                    </div> */}
                </Card>
                <div className={styles.floatLabelContainer}>
                    <FloatLabel className={styles.noticeInputContainer}>
                        <InputTextarea id="description" value={content} onChange={(e) => setContent(e.target.value)} rows={5} cols={30} className={styles.inputTextarea} />
                        <label htmlFor="description">공지</label>
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
                        <Button label="List" raised className={styles.listButton} onClick={() => setVisible(true)} />
                        <Dialog header="Notice List" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} className={styles.d}>
                            <DataTable value={notices}>
                                <Column field="content" header="Content" />
                                <Column field="noticedate" header="Date" />
                                <Column body={actionBodyTemplate} header="Delete" />
                            </DataTable>
                        </Dialog>
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