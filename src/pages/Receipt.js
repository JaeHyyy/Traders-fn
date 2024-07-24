import React, { useState, useEffect } from 'react';
import axios from 'axios';
import receiptt from '../pages/Receipt.module.css';
import Table from '../components/Table';

const Receipt=() => {
   const columns = [
    { header: '순번', accessor: null },
    { header: '입고코드', accessor: null},
    { header: '입고날짜', accessor: 'movdate' },
    { header: '입고건수', accessor: 'count' },
    { header: '검수상태', accessor: null},
    { header: '검수', accessor: null}
   ];
    const [movement, setMovement] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:8090/traders/receipt')
        .then(response => {
          setMovement(response.data);
        })
        .catch(error => {
          console.error('돌아가. 뭔가 잘못되었다.', error);
        });
    }, []);


    return <Table columns={columns} data={movement} />;
};

export default Receipt;