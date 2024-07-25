import Stock from './Stock';

const StockList = () => {
  const columns = [
    { header: '재고코드', accessor: 'stockid' },
    { header: '상품코드', accessor: 'gcode' },
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