import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ExpiringProducts = ({ date }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 여기서 선택된 날짜에 해당하는 유통기한 임박 상품을 가져오는 API 호출을 수행합니다.
    // 예시로 더미 데이터를 사용합니다.
    const fetchExpiringProducts = async () => {
      // API 호출 대신 더미 데이터
      const dummyData = [
        { id: 1, name: '대왕남포오징어10kg', expiryDate: '2024-07-21' },
        { id: 2, name: '고등어', expiryDate: '2024-07-21' },
        // ... 더 많은 상품 데이터
      ];
      setProducts(dummyData.filter(product => product.expiryDate === format(date, 'yyyy-MM-dd')));
    };

    fetchExpiringProducts();
  }, [date]);

  return (
    <div className="expiring-products">
      <h3>{format(date, 'yyyy년 MM월 dd일')} 유통기한 임박 상품</h3>
      {products.length > 0 ? (
        <ul>
          {products.map(product => (
            <li key={product.id}>{product.name} - 유통기한: {product.expiryDate}</li>
          ))}
        </ul>
      ) : (
        <p>해당 날짜의 유통기한 임박 상품이 없습니다.</p>
      )}
    </div>
  );
};

export default ExpiringProducts;