import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import api from '../util/api';
import AdminMenu from '../components/AdminMenu';
import styles from './AdminGoods.module.css';
import { getAuthToken } from '../util/auth';

const AdminGoods = () => {
    const [goods, setGoods] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const savedBranchId = localStorage.getItem('branchId');
    const navigate = useNavigate();

    const [newGoods, setNewGoods] = useState({
        gcode: '',
        gname: '',
        gcategory: '',
        gcostprice: '',
        gcompany: '',
        gunit: '',
        gimage: null,
    });

    const categories = [
        { label: '곡류', value: '곡류' },
        { label: '과일', value: '과일' },
        { label: '채소', value: '채소' },
        { label: '유제품', value: '유제품' },
        { label: '소스류', value: '소스류' },
        { label: '수산물', value: '수산물' },
        { label: '건해산', value: '건해산' },
        { label: '정육', value: '정육' },
        { label: '계란류', value: '계란류' },
        { label: '즉석식품', value: '즉석식품' },
        { label: '음료', value: '음료' },
        { label: '커피/원두/차', value: '커피/원두/차' },
        { label: '생활용품', value: '생활용품' },
        { label: '가구', value: '가구' },
        { label: '주방용품', value: '주방용품' },
        { label: '반려동물', value: '반려동물' },
        { label: '유아용품', value: '유아용품' },
        { label: '패션용품', value: '패션용품' },
        { label: '가전용품', value: '가전용품' },
    ];

    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        setNewGoods(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        api.get('/traders/home')
            .then(response => {
                if (savedBranchId != 'admin') {
                    navigate('/');
                    alert("접근 권한이 없습니다.");
                } else {
                    setGoods(response.data);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Keyword Search"
                    style={{ width: '200px' }}
                />
            </div>
        );
    };

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const priceBodyTemplate = (rowData) => {
        return rowData.gcostprice.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
    };

    const priceFilterTemplate = (options) => {
        return (
            <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value)} mode="currency" currency="KRW" locale="ko-KR" />
        );
    };

    const header = renderHeader();


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGoods(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('goods', new Blob([JSON.stringify({
            gcode: newGoods.gcode,
            gname: newGoods.gname,
            gcategory: newGoods.gcategory,
            gcostprice: newGoods.gcostprice,
            gcompany: newGoods.gcompany,
            gunit: newGoods.gunit,
        })], { type: 'application/json' }));
        // 파일 추가
        if (newGoods.gimage) {
            formData.append('file', newGoods.gimage);
        }

        const token = getAuthToken();
        // axios.post('http://10.10.10.31:8090/home/save', formData, {
        axios.post('http://localhost:8090/traders/goodsadd', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                setGoods(prevGoods => [...prevGoods, response.data]);
                setNewGoods({
                    gcode: '',
                    gname: '',
                    gcategory: '',
                    gcostprice: '',
                    gcompany: '',
                    gunit: '',
                    gimage: null,
                });
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Goods Added Successfully' });
            })
            .catch(error => {
                console.error('Error adding goods:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to Add Goods' });
            });
    }

    const imageBodyTemplate = (rowData) => {
        return (
            <img
                // src={`http://10.10.10.31:8090/traders/images/items/${rowData.gimage}.png`}
                src={`http://localhost:8090/traders/images/items/${rowData.gimage}.png`}
                alt={rowData.gname}
                style={{ width: '50px', height: '50px' }}
            />
        );
    };


    const handleFileChange = (e) => {
        setNewGoods(prevState => ({
            ...prevState,
            gimage: e.target.files[0]
        }));
    };


    return (
        <>
            <AdminMenu />
            <div className={styles.container}>
                <div className={styles.card}>
                    <DataTable value={goods} paginator showGridlines rows={9} loading={loading} dataKey="gcode"
                        filters={filters} globalFilterFields={['gcode', 'gname', 'gcompany', 'gcategory']} header={header}
                        emptyMessage="No goods found." onFilter={(e) => setFilters(e.filters)}>
                        <Column field="gcode" header="Code" />
                        <Column header="Image" body={imageBodyTemplate} />
                        <Column field="gname" header="Name" />
                        <Column field="gcategory" header="Category" />
                        <Column field="gcostprice" header="Cost Price" dataType="numeric" body={priceBodyTemplate} />
                        <Column field="gcompany" header="Company" />
                        <Column field="gunit" header="Unit" />
                    </DataTable>
                </div>
                <Button icon="pi pi-plus" rounded text raised onClick={() => setVisible(true)} className={styles.addb} />
                <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className={styles.addgoods}>
                    <form onSubmit={handleSubmit} className={styles.addgoods}>
                        <h2 className={styles.addtitle}>New Product</h2>
                        <div>
                            <InputText className={styles.inputText} name="gcode" placeholder="상품번호" value={newGoods.gcode} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <InputText className={styles.inputText} name="gname" placeholder="상품명" value={newGoods.gname} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Dropdown className={styles.dropdown} name="gcategory" placeholder="카테고리" value={newGoods.gcategory} options={categories} onChange={handleDropdownChange} required />
                        </div>
                        <div>
                            <InputNumber inputId="integeronly" className={styles.inputNumber} name="gcostprice" placeholder="가격" value={newGoods.gcostprice} onValueChange={handleInputChange} />
                            {/* mode="currency" currency="KRW" required */}
                        </div>
                        <div>
                            <InputText className={styles.inputText} name="gcompany" placeholder="브랜드" value={newGoods.gcompany} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <InputText className={styles.inputText} name="gunit" placeholder="개/box" value={newGoods.gunit} onChange={handleInputChange} required />
                        </div>
                        <div >
                            <Toast ref={toast}></Toast>
                            <InputText type="file" className={styles.fileUpload} name="gimage" accept="image/*" onChange={handleFileChange} required />
                        </div>
                        <Button type="submit" label="Add Product" className={styles.addbutton} />
                    </form>
                </Sidebar>
            </div>
        </>
    );
};

export default AdminGoods;
