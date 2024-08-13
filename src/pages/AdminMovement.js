import React, { useRef, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from 'primereact/toast';
import axios from 'axios';
import AdminMenu from '../components/AdminMenu';
import styles from './AdminMovement.module.css';
import { getAuthToken } from '../util/auth';
import 'primereact/resources/themes/saga-blue/theme.css'; // Primereact 테마 CSS
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // PrimeReact 아이콘 CSS


const AdminMovement = () => {
    const [movement, setMovement] = useState([]);
    const [selectedMovement, setSelectedMovement] = useState(null);
    const [checkedStates, setCheckedStates] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const token = getAuthToken();
        axios.get('http://localhost:8090/traders/adminmovement', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.data && response.data.length > 0) {
                    console.log('Fetched data:', response.data); // 응답 데이터 확인

                    // 데이터 변환: 배열을 객체로 변환
                    const transformedData = response.data.map(item => ({
                        branchName: item[0],  // 배열의 첫 번째 요소
                        movdate: item[1],     // 배열의 두 번째 요소
                        count: item[2],        // 배열의 세 번째 요소
                        movstatus: '출고 대기'
                    }));

                    const initialCheckedStates = {};
                    transformedData.forEach(item => {
                        initialCheckedStates[item.branchName + item.movdate] = item.movstatus === '출고 완료';
                    });

                    setMovement(transformedData);
                    setCheckedStates(initialCheckedStates);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const actionBodyTemplate = (rowData) => {
        return (
            <Button icon="pi pi-search" rounded text style={{ color: 'greenyellow' }} onClick={() => handleButtonClick(rowData)} />
        );
    }

    // 버튼 클릭 시 실행되는 함수
    const handleButtonClick = (rowData) => {
        setDialogVisible(true);
        const token = getAuthToken();
        axios.get('http://localhost:8090/traders/adminmov', {
            params: {
                branchName: rowData.branchName,
                movdate: rowData.movdate,
                movstatus: rowData.movstatus
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setSelectedMovement(response.data);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
            })
            .catch(error => {
                console.error('Error updating status:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
            });
    };

    const handleStatusUpdate = (rowData, newStatus) => {
        const token = getAuthToken();
        axios.post('http://localhost:8090/traders/updateStatus', {
            branchName: rowData.branchName,
            movdate: rowData.movdate,
            movstatus: newStatus
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("Status updated successfully:", response.data);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
                setMovement(prevMovement =>
                    prevMovement.map(mov =>
                        mov.branchName === rowData.branchName && mov.movdate === rowData.movdate
                            ? { ...mov, movstatus: newStatus }
                            : mov
                    )
                );
            })
            .catch(error => {
                console.error('Error updating status:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
            });
    };

    const handleSwitchChange = (rowData, value) => {
        const newStatus = value ? '출고 완료' : '출고 대기';
        const key = rowData.branchName + rowData.movdate;

        setCheckedStates(prevState => ({
            ...prevState,
            [key]: value
        }));

        handleStatusUpdate(rowData, newStatus);
    };

    const statusAction = (rowData) => {
        const key = rowData.branchName + rowData.movdate;
        return (
            <InputSwitch
                checked={checkedStates[key]}
                onChange={(e) => handleSwitchChange(rowData, e.value)}
            />
        );
    };


    return (
        <>
            <AdminMenu />
            <div className={styles.container}>
                <div className={styles.card}>
                    <DataTable value={movement} >
                        <Column field="branchName" header="지점명" />
                        <Column field="movdate" header="요청 날짜" />
                        <Column field="count" header="건수" />
                        <Column body={actionBodyTemplate} header="출고 상세 내역" />
                        <Column body={statusAction} header="출고 상태" />
                    </DataTable>
                </div>
                <div>
                    <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)}
                        header="Details" style={{ width: '70vw' }}
                        maximizable modal contentStyle={{ height: '70vh', padding: '2rem' }}>

                        <DataTable value={selectedMovement || []}>
                            <Column field="movement.gcode" header="Gcode" />
                            <Column field="goods.gname" header="Gname" />
                            <Column field="goods.gcompany" header="Company" />
                            <Column field="movement.movquantity" header="Movquantity" />
                            <Column field="goods.gunit" header="Gunit" />
                            <Column field="goods.price" header="Price" />
                            <Column field="movement.movstatus" header="Status" />
                        </DataTable>
                    </Dialog>
                </div>
                <Toast ref={toast} />
            </div>
        </>

    );
}

export default AdminMovement;