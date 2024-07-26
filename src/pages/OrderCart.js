import { render } from '@testing-library/react';
import OrderCartTable from './OrderCartTable';



const OrderCart = () => {
  const columns = [
    { header: '순번' },
    { header: '상품코드', accessor: 'gcode', render:(row)=>row.goods.gcode},
    { 
      header: '이미지', 
      accessor: 'gimage',
       render: (row) => <img src={`http://localhost:8090/traders/images/items/${row.goods.gimage}.png`} alt={row.goods.gname} style={{width: '50px', height: '50px'}} />
    },
    { header: '카테고리', accessor: 'gcategory',render:(row)=>row.goods.gcategory },
    { header: '상품명(단위)', accessor: 'gname',render:(row)=>row.goods.gname },
    // { header: '유통기한' },
    { header: '제조사', accessor: 'gcompany',render:(row)=>row.goods.gcompany },
    { header: '원가', accessor: 'gcostprice',render:(row)=>row.goods.gcostprice },
    { 
      header: '수량', accessor: 'gcount', 
      render: (row) => (
          <input type="number" defaultValue={row.gcount} style={{width: '50px'}} />   )},
    { header: '단위', accessor: 'gunit',render:(row)=>   
        <div>
          <select defaultValue={row.goods.gunit}/>
            {/* <option value="box">box</option>
            <option value="개">개</option>
          </select> */}
        </div>},
   
    { header: '합계(단위: won)' },
  ];

 

  return <OrderCartTable columns={columns} />;
};

export default OrderCart;