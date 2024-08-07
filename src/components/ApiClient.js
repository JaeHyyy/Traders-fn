// import axios from 'axios';

// // Axios 인스턴스 생성
// const ApiClient = axios.create({
//     baseURL: 'http://localhost:8090',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// // 요청 인터셉터를 사용해 토큰을 헤더에 추가
// ApiClient.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

// export default ApiClient;
