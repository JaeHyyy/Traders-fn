import Stock from './Stock';

const StockList = () => {
  const columns = [
    { header: '재고코드', accessor: 'stockid' },
    { header: '상품코드', accessor: 'goods.gcode', render: (row) => row.goods.gcode },
    //stock 테이블의 값은 그냥 키값으로 들고와지는데
    //외래키나 조인으로 연결된 goods 테이블의 정보는
    //render를 써서 가져와야한다
    { header: "이미지", accessor: 'goods.gimage', render: (row) => <img src={`http://localhost:8090/traders/images/items/${row.goods.gimage}.png`} alt={row.goods.gname} style={{width: '50px', height: '50px'}} /> },
    { header: '카테고리', accessor: 'goods.gcategory', render: (row) => row.goods.gcategory},
    { 
      header: '재고수량', 
      accessor: 'stockquantity'
    },
    { header: '유통기한', accessor: 'expdate' },
    { header: '상품판매가', accessor: 'gprice' },
    { header: '대분류', accessor: 'loc1' },
    { header: '중분류', accessor: 'loc2' },
    { header: '소분류', accessor: 'loc3' },
  ];

  return <Stock columns={columns} />;
};

export default StockList;