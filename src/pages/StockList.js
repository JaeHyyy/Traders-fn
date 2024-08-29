import Stock from './Stock';


const StockList = () => {
  const columns = [
    { header: '재고코드', accessor: 'stockid' },
    { header: '상품코드', accessor: 'goods.gcode', render: (row) => row.goods.gcode },
    { header: "이미지", accessor: 'goods.gimage', render: (row) => <img src={`http://traders5bootapp.ap-northeast-1.elasticbeanstalk.com/traders/images/items/${row.goods.gimage}.png`} alt={row.goods.gname} style={{ width: '50px', height: '50px' }} /> },
    { header: "상품명(단위)", accessor: 'goods.gname', render: (row) => row.goods.gname },
    { header: '카테고리', accessor: 'goods.gcategory', render: (row) => row.goods.gcategory },
    { header: "단위", accessor: 'goods.gunit', render: (row) => row.goods.gunit },
    {
      header: '재고수량',
      accessor: 'stockquantity'
    },
    { header: '유통기한', accessor: 'expdate' },
    { header: '상품판매가', accessor: 'gprice', render: (row) => row.gprice.toLocaleString('ko-KR') },
    { header: '대분류', accessor: 'loc1' },
    { header: '중분류', accessor: 'loc2' },
    { header: '소분류', accessor: 'loc3' },
  ];

  return <Stock columns={columns} />;
};

export default StockList;