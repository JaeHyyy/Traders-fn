import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../util/api';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/user.png';
//import lockIcon from '../assets/lock.png';
import phoneIcon from '../assets/phone.png';
import ofName from '../assets/officename.png';
import ofPhone from '../assets/officephone.png';
import styles from './MyPage.module.css';

const MyPage = () => {
    const [formData, setFormData] = useState({
        branchId: '',
        passwd: '',
        branchName: '',
        branchNum: '',
        post: '',
        addr1: '',
        addr2: '',
        phoneNum: ''
    });

    const navigate = useNavigate();


    useEffect(() => {
        const savedBranchId = localStorage.getItem('branchId');
        if (savedBranchId) {
            // 서버로부터 기존 사용자 데이터를 가져옴
            api.get(`/traders/user/${savedBranchId}`)
                .then(response => {
                    setFormData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);


    useEffect(() => {
        const savedBranchId = localStorage.getItem('branchId');
        if (savedBranchId) {
            setFormData(prevState => ({
                ...prevState,
                branchId: savedBranchId
            }));
        }

        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => {
            console.log('Daum Postcode script loaded');
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToUpdate = {};
        for (const key in formData) {
            if (formData[key] !== '') {
                dataToUpdate[key] = formData[key];
            }
        }

        api.post('/traders/updateBranch', dataToUpdate)
            .then(response => {
                console.log(response.data);
                alert('회원정보 수정 성공');
                navigate('/');
            })
            .catch(error => {
                console.error('오류 발생:', error);
                alert('회원정보 수정 실패: ' + error.message);
            });
    };

    const handlePostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                var roadAddr = data.roadAddress;
                var extraRoadAddr = '';

                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraRoadAddr !== '') {
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                setFormData(prevState => ({
                    ...prevState,
                    post: data.zonecode,
                    addr1: roadAddr + extraRoadAddr,
                    addr2: data.jibunAddress
                }));

                var guideTextBox = document.getElementById("guide");
                if (data.autoRoadAddress) {
                    var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                    guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                    guideTextBox.style.display = 'block';
                } else if (data.autoJibunAddress) {
                    var expJibunAddr = data.autoJibunAddress;
                    guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                    guideTextBox.style.display = 'block';
                } else {
                    guideTextBox.innerHTML = '';
                    guideTextBox.style.display = 'none';
                }
            }
        }).open();
    };


    return (
        <div id={styles.signup_page}>
            <div className={styles.signup_box}>
                <form onSubmit={handleSubmit} id={styles.signup_form}>
                    <h2 className={styles.changetitle}>회원 정보 수정</h2>
                    <div className={styles.inputContainer}>
                        <img src={userIcon} alt="user icon" className={`${styles.icon}`} />
                        <input
                            type="text"
                            name="branchId"
                            placeholder="@sample.com"
                            className={`${styles.input}`}
                            value={formData.branchId}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <img src={phoneIcon} alt="phone icon" className={`${styles.icon}`} />
                        <input
                            type="tel"
                            name="phoneNum"
                            placeholder="'-' 없이 입력해주세요."
                            className={`${styles.input} `}
                            value={formData.phoneNum}
                            onChange={handleChange}
                        />
                    </div>

                    <hr />
                    <div className={styles.addressSection}>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                name="post"
                                className={`${styles.input} ${styles.addressInput}`}
                                placeholder="우편번호"
                                value={formData.post}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <button type="button" className={styles.button} onClick={handlePostcode}>우편번호 찾기</button>
                        </div>
                    </div>
                    <div className={styles.addressSection}>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                name="addr1"
                                className={`${styles.input} ${styles.addressInput}`}
                                placeholder="도로명주소"
                                value={formData.addr1}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                name="addr2"
                                className={`${styles.input} ${styles.addressInput}`}
                                placeholder="지번주소"
                                value={formData.addr2}
                                onChange={handleChange}
                            />
                            <span id="guide" className={styles.guide}></span>
                        </div>
                    </div>

                    <hr />
                    <div className={styles.inputContainer}>
                        <img src={ofName} alt="office name icon" className={`${styles.icon} `} />
                        <input
                            type="text"
                            name="branchName"
                            className={`${styles.input} `}
                            placeholder="지점명"
                            value={formData.branchName}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <img src={ofPhone} alt="office phone number icon" className={`${styles.icon}`} />
                        <input
                            type="text"
                            name="branchNum"
                            className={`${styles.input}`}
                            placeholder="사업자번호"
                            value={formData.branchNum}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className={styles.signup}>
                        <input type="submit" value="변경 저장" className={styles.btn_signup} />
                    </div>
                </form>
                <div className={styles.changepw}>
                    <button type="basic" className={styles.btn_changepw}>비밀번호 변경</button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;