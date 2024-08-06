import Table from './Table';

const ProductList = () => {
  const columns = [
    { header: '순번', accessor: 'id' },
    { header: '상품코드', accessor: 'code' },
    { 
      header: '이미지', 
      accessor: 'image',
      render: (row) => <img src={require(`../assets/${row.image}`)} alt={row.name} style={{width: '50px', height: '50px'}} />
    },
    { header: '카테고리', accessor: 'category' },
    { header: '상품명(단위)', accessor: 'name' },
    { header: '제조사', accessor: 'manufacturer' },
    { header: '원가', accessor: 'cost' },
    { 
      header: '수량', 
      accessor: 'quantity',
      render: (row) => (
        <div>
          <input type="number" defaultValue={row.quantity} style={{width: '50px'}} />
          <select defaultValue={row.unit}>
            <option value="box">box</option>
            <option value="개">개</option>
          </select>
        </div>
      )
    },
    { header: '합계(단위: won)', accessor: 'total' },
  ];

  const data = [
    {
      id: 1,
      code: '2407137855',
      image: 'apple.png',
      category: '과일',
      name: '햇살사과(1.2kg)',
      manufacturer: '린농수산',
      cost: 10000,
      quantity: 2,
      unit: 'box',
      total: 20000
    },
    {
        id: 2,
        code: '2407377777',
        image: 'apple.png',
        category: '의류',
        name: '재형사과(7.8kg)',
        manufacturer: '린농수산',
        cost: 100000,
        quantity: 7,
        unit: 'box',
        total: 70000
      },
  ];

  return <Table columns={columns} data={data} />;
};

export default ProductList;