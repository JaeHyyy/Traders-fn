import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
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
        gimage: '',
    });

    useEffect(() => {
        const token = getAuthToken();
        // axios.get('http://10.10.10.31:8090/traders/home', {
        axios.get('http://TradersApp5.us-east-2.elasticbeanstalk.com/traders/home', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
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
        formData.append('gcode', newGoods.gcode);
        formData.append('gname', newGoods.gname);
        formData.append('gcategory', newGoods.gcategory);
        formData.append('gcostprice', newGoods.gcostprice);
        formData.append('gcompany', newGoods.gcompany);
        formData.append('gunit', newGoods.gunit);

        // 파일 추가
        if (newGoods.gimage) {
            formData.append('file', newGoods.gimage);
        }

        const token = getAuthToken();
        // axios.post('http://10.10.10.31:8090/home/save', formData, {
        axios.post('http://TradersApp5.us-east-2.elasticbeanstalk.com/home/save', formData, {
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
                    gimage: '',
                });
            })
            .catch(error => {
                console.error('Error adding goods:', error);
            });
    }

    const imageBodyTemplate = (rowData) => {
        return (
            <img
                // src={`http://10.10.10.31:8090/traders/images/items/${rowData.gimage}.png`}
                src={`http://TradersApp5.us-east-2.elasticbeanstalk.com/traders/images/items/${rowData.gimage}.png`}
                alt={rowData.gname}
                style={{ width: '50px', height: '50px' }}
            />
        );
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
                <Button icon="pi pi-plus" rounded text raised onClick={() => setVisible(true)} className="p-mt-3" />
                <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" style={{ width: '30vw' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '80%', justifyContent: 'center' }}>
                        <h2 className={styles.addtitle}>New Products</h2>
                        <div>
                            <label htmlFor="gcode" />
                            <InputText id="gcode" name="gcode" placeholder="상품 번호" value={newGoods.gcode} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="gname" />
                            <InputText id="gname" name="gname" placeholder="상품명" value={newGoods.gname} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="gcategory" />
                            <InputText id="gcategory" name="gcategory" placeholder="카테고리" value={newGoods.gcategory} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="gcostprice" />
                            <InputNumber id="gcostprice" name="gcostprice" placeholder="가격" value={newGoods.gcostprice} onValueChange={handleInputChange} mode="currency" currency="KRW" locale="ko-KR" required />
                        </div>
                        <div>
                            <label htmlFor="gcompany" />
                            <InputText id="gcompany" name="gcompany" placeholder="제조 회사" value={newGoods.gcompany} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="gunit" />
                            <InputText id="gunit" name="gunit" placeholder="단위" value={newGoods.gunit} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="gimage" />
                            <Toast ref={toast}></Toast>
                            <FileUpload mode="basic" name="file" placeholder="상품 이미지 업로드" url="http://localhost:8090/home/save" multiple accept="image/*" maxFileSize={1000000} onUpload={onUpload} />
                        </div>
                        <Button type="submit" label="Add Goods" className="p-mt-3" />
                    </form>
                </Sidebar>
            </div>
        </>
    );
};

export default AdminGoods;
