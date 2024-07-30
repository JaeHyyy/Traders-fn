// import React from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain.module.css';

// const MobileMain = () => {
//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         {/* 카드의 타이틀 */}
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {/* 카드 컨텐츠 */}
//                         <div className={mobileMain.card_list}>
//                             {/* 카드 리스트 */}
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     A
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     B
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     C
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     D
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     E
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     F
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     G
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     H
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                             <div className={mobileMain.card_section}>
//                                 <div className={mobileMain.section_content}>
//                                     I
//                                 </div>
//                                 <input type="checkbox"></input>
//                             </div>
//                         </div>
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MobileMain;

//--------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain.module.css';

// const MobileMain = () => {
//     const [qrCodes, setQrCodes] = useState({});
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQrCodes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
//                 const text = await response.text();

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
//                 }

//                 try {
//                     const data = JSON.parse(text);
//                     setQrCodes(data);
//                 } catch (error) {
//                     throw new Error(`Error parsing JSON: ${error.message}, response: ${text}`);
//                 }
//             } catch (error) {
//                 console.error("Error fetching QR codes:", error);
//                 setError(error.message);
//             }
//         };

//         fetchQrCodes();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {Object.keys(qrCodes).map(date => (
//                             <div key={date} className={mobileMain.card_section}>
//                                 <h3>{date}</h3>
//                                 <img src={`data:image/png;base64,${qrCodes[date]}`} alt={`QR Code for ${date}`} />
//                                 <input type="checkbox"></input>
//                             </div>
//                         ))}
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileMain;

// import React, { useEffect, useState } from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain.module.css';

// const MobileMain = () => {
//     const [qrCodes, setQrCodes] = useState({});
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQrCodes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
//                 const text = await response.text();

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
//                 }

//                 try {
//                     const data = JSON.parse(text);
//                     setQrCodes(data);
//                 } catch (error) {
//                     throw new Error(`Error parsing JSON: ${error.message}, response: ${text}`);
//                 }
//             } catch (error) {
//                 console.error("Error fetching QR codes:", error);
//                 setError(error.message);
//             }
//         };

//         fetchQrCodes();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {Object.keys(qrCodes).map(date => (
//                             <div key={date} className={mobileMain.card_section}>
//                                 <h3>{date}</h3>
//                                 {/* <img src={`data:image/png;base64,${qrCodes[date].image}`} alt={`QR Code for ${date}`} /> */}
//                                 <pre>{qrCodes[date].text}</pre> {/* Display the text data */}
//                                 <input type="checkbox"></input>
//                             </div>
//                         ))}
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileMain;

//--------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain.module.css';

// const MobileMain = () => {
//     const [qrCodes, setQrCodes] = useState({});
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQrCodes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
//                 const text = await response.text();

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
//                 }

//                 try {
//                     const data = JSON.parse(text);
//                     setQrCodes(data);
//                 } catch (error) {
//                     throw new Error(`Error parsing JSON: ${error.message}, response: ${text}`);
//                 }
//             } catch (error) {
//                 console.error("Error fetching QR codes:", error);
//                 setError(error.message);
//             }
//         };

//         fetchQrCodes();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {Object.keys(qrCodes).map(date => (
//                             <div key={date} className={mobileMain.card_section}>
//                                 <h3>{date}</h3>
//                                 <pre>{qrCodes[date].text}</pre>
//                                 <input type="checkbox"></input>
//                             </div>
//                         ))}
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileMain;

//--------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain2.module.css';

// const MobileMain = () => {
//     const [qrCodes, setQrCodes] = useState({});
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQrCodes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
//                 const text = await response.text();

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
//                 }

//                 try {
//                     const data = JSON.parse(text);
//                     setQrCodes(data);
//                 } catch (error) {
//                     throw new Error(`Error parsing JSON: ${error.message}, response: ${text}`);
//                 }
//             } catch (error) {
//                 console.error("Error fetching QR codes:", error);
//                 setError(error.message);
//             }
//         };

//         fetchQrCodes();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {Object.keys(qrCodes).map(date => (
//                             qrCodes[date].movements.map((movement, index) => (
//                                 <div key={`${date}-${index}`} className={mobileMain.card_section}>
//                                     <h3>{date}</h3>
//                                     <pre>{movement}</pre>
//                                     <input type="checkbox"></input>
//                                 </div>
//                             ))
//                         ))}
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileMain;

//--------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain2.module.css';

// const MobileMain = () => {
//     const [qrCodes, setQrCodes] = useState({});
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQrCodes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
//                 const text = await response.text();

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
//                 }

//                 try {
//                     const data = JSON.parse(text);
//                     setQrCodes(data);
//                 } catch (error) {
//                     throw new Error(`Error parsing JSON: ${error.message}, response: ${text}`);
//                 }
//             } catch (error) {
//                 console.error("Error fetching QR codes:", error);
//                 setError(error.message);
//             }
//         };

//         fetchQrCodes();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {Object.keys(qrCodes).map(date => (
//                             qrCodes[date] && qrCodes[date].movements ? (
//                                 qrCodes[date].movements.map((movement, index) => (
//                                     <div key={`${date}-${index}`} className={mobileMain.card_section}>
//                                         <h3>{date}</h3>
//                                         <pre>{movement}</pre>
//                                         <input type="checkbox"></input>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div key={date} className={mobileMain.card_section}>
//                                     <h3>{date}</h3>
//                                     <p>No movements available</p>
//                                 </div>
//                             )
//                         ))}
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileMain;

//--------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain2.module.css';

// const MobileMain = () => {
//     const [qrCodes, setQrCodes] = useState({});
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQrCodes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
//                 const text = await response.text();

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
//                 }

//                 console.log('Raw response text:', text);

//                 try {
//                     const data = JSON.parse(text);
//                     console.log('Parsed JSON data:', data);
//                     setQrCodes(data);
//                 } catch (error) {
//                     throw new Error(`Error parsing JSON: ${error.message}, response: ${text}`);
//                 }
//             } catch (error) {
//                 console.error("Error fetching QR codes:", error);
//                 setError(error.message);
//             }
//         };

//         fetchQrCodes();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {Object.keys(qrCodes).map(date => (
//                             qrCodes[date] && qrCodes[date].movements ? (
//                                 qrCodes[date].movements.map((movement, index) => (
//                                     <div key={`${date}-${index}`} className={mobileMain.card_section}>
//                                         <h3>{date}</h3>
//                                         <pre>{movement}</pre>
//                                         <input type="checkbox"></input>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div key={date} className={mobileMain.card_section}>
//                                     <h3>{date}</h3>
//                                     <p>No movements available</p>
//                                 </div>
//                             )
//                         ))}
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileMain;

//--------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import logo from '../assets/logo.png';
// import mobileMain from './MobileMain2.module.css';

// const MobileMain = () => {
//     const [qrCodesText, setQrCodesText] = useState("");
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQrCodes = async () => {
//             try {
//                 const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
//                 const text = await response.text();

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
//                 }

//                 console.log('Raw response text:', text);
//                 setQrCodesText(text);
//             } catch (error) {
//                 console.error("Error fetching QR codes:", error);
//                 setError(error.message);
//             }
//         };

//         fetchQrCodes();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={mobileMain.mainMobile_page}>
//             <div className={mobileMain.mainMobile_box}>
//                 <img src={logo} alt="로고" className={mobileMain.logo} />
//                 <div className={mobileMain.card_box}>
//                     <div className={mobileMain.card_title}>
//                         <h6>입고내역서</h6>
//                         <input type="checkbox" />
//                     </div>
//                     <div className={mobileMain.card_content}>
//                         {qrCodesText.split("\n").map((line, index) => (
//                             <div key={index} className={mobileMain.card_section}>
//                                 <pre>{line}</pre>
//                                 <input type="checkbox" />
//                             </div>
//                         ))}
//                     </div>
//                     <div className={mobileMain.mobileLogin}>
//                         <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileMain;

//--------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import logo from '../assets/logo.png';
import mobileMain from './MobileMain2.module.css';

const MobileMain = () => {
    const [qrCodesText, setQrCodesText] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQrCodes = async () => {
            try {
                const response = await fetch("http://localhost:8090/traders/api/qrcodeDivisions");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(`HTTP 에러! 상태: ${response.status}, 응답: ${JSON.stringify(data)}`);
                }

                console.log('전체 응답 데이터:', data);

                // 날짜별 객체에서 "text" 속성만 추출
                const texts = Object.values(data).map(item => item.text).filter(Boolean).join('\n');
                console.log('추출된 텍스트:', texts);

                setQrCodesText(texts);

            } catch (error) {
                console.error("QR 코드 가져오기 에러:", error);
                setError(error.message);
            }
        };

        fetchQrCodes();
    }, []);

    if (error) {
        return <div>에러: {error}</div>;
    }

    return (
        <div className={mobileMain.mainMobile_page}>
            <div className={mobileMain.mainMobile_box}>
                <img src={logo} alt="로고" className={mobileMain.logo} />
                <div className={mobileMain.card_box}>
                    <div className={mobileMain.card_title}>
                        <h6>입고내역서</h6>
                        <input type="checkbox" />
                    </div>
                    <div className={mobileMain.card_content}>
                        {qrCodesText ? qrCodesText.split("\n").map((line, index) => (
                            <div key={index} className={mobileMain.card_section}>
                                <pre>{line}</pre>
                                <input type="checkbox" />
                            </div>
                        )) : <p>로딩 중...</p>}
                    </div>
                    <div className={mobileMain.mobileLogin}>
                        <input type="submit" value="검수완료" className={mobileMain.btn_mobileLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMain;






