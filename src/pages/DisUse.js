import { render } from '@testing-library/react';
import DisUseTable from './DisUseTable';
import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../util/api';

const DisUse = () => {

  const [disUseList, setDisUseList] = useState([]);
  const branchId = localStorage.getItem('branchId');

  useEffect(() => {
    if (branchId) {
      api.get(`/traders/disuse/branch/${branchId}`)
        .then(response => {
          setDisUseList(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error('There was an error fetching the goods!', error);
        });
    } else {
      console.error('No branchId found in localStorage!');
    }
  }, [branchId]);


  const columns = [
    { header: '순번', render: (_, rowIndex) => rowIndex + 1 },
    { header: '상품코드', accessor: 'gcode', render: (row) => row.stock.goods.gcode },
    {
      header: '이미지',
      accessor: 'gimage',
      // render: (row) => <img src={`http://10.10.10.31:8090/traders/images/items/${row.stock.goods.gimage}.png`} alt={row.stock.goods.gname} style={{ width: '50px', height: '50px' }} />
      render: (row) => <img src={`http://traders5bootapp.ap-northeast-1.elasticbeanstalk.com//traders/images/items/${row.stock.goods.gimage}.png`} alt={row.stock.goods.gname} style={{ width: '50px', height: '50px' }} />
    },
    { header: '카테고리', accessor: 'gcategory', render: (row) => row.stock.goods.gcategory },
    { header: '상품명(단위)', accessor: 'gname', render: (row) => row.stock.goods.gname },
    { header: '제조사', accessor: 'gcompany', render: (row) => row.stock.goods.gcompany },
    { header: '유통기한', accessor: 'expdate', render: (row) => row.stock.expdate },
    { header: '재고량', accessor: 'stockquantity', render: (row) => row.stock.stockquantity },
    { header: '단위', accessor: 'gunit', render: (row) => row.stock.goods.gunit },
    { header: '상품위치', accessor: 'loc1', render: (row) => [row.stock.loc1, row.stock.loc2, row.stock.loc3].join('-') },
    { header: '폐기처리일', accessor: 'disdate', render: (row) => row.disdate }
  ];


  return <DisUseTable columns={columns} />;
};

export default DisUse;