import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import userIcon from '../assets/user.png';
import lockIcon from '../assets/lock.png';
import phoneIcon from '../assets/phone.png';
import ofName from '../assets/officename.png';
import ofPhone from '../assets/officephone.png';
import styles from './Signup.module.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        branchId: '',
        passwd: '',
        branchName: '',
        nickname: '',
        branchNum: '',
        branchImage: null, // 파일을 null로 초기화
        post: '',
        addr1: '',
        addr2: '',
        phoneNum: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
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

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            branchImage: e.target.files[0] // 파일 객체로 업데이트
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('branchId', formData.branchId);
        data.append('passwd', formData.passwd);
        data.append('branchName', formData.branchName);
        data.append('nickname', formData.nickname);
        data.append('branchNum', formData.branchNum);
        data.append('post', formData.post);
        data.append('addr1', formData.addr1);
        data.append('addr2', formData.addr2);
        data.append('phoneNum', formData.phoneNum);

        // 파일 객체를 FormData에 추가
        if (formData.branchImage) {
            data.append('branchImage', formData.branchImage);
        }

        axios.post('http://localhost:8090/traders/signup', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                alert('회원가입 성공');
                navigate('/login');
            })
            .catch(error => {
                console.error('오류 발생:', error);
                alert('회원가입 실패: ' + error.message);
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
                    <img src={logo} alt="로고" className={styles.logo} />

                    <div className={styles.inputContainer}>
                        <img src={userIcon} alt="user icon" className={styles.icon} />
                        <input type="text" name="branchId" placeholder="@sample.com" className={styles.input} value={formData.branchId} onChange={handleChange} />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={lockIcon} alt="lock icon" className={styles.icon} />
                        <input type="password" name="passwd" placeholder="Password" className={styles.input} value={formData.passwd} onChange={handleChange} />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={phoneIcon} alt="phone icon" className={styles.icon} />
                        <input type="tel" name="phoneNum" placeholder="'-' 없이 입력해주세요." className={styles.input} value={formData.phoneNum} onChange={handleChange} />
                    </div>
                    <br />
                    <hr />
                    <div className={styles.addressSection}>
                        <div className={styles.inputContainer}>
                            <input type="text" name="post" className={`${styles.input} ${styles.addressInput}`} placeholder="우편번호" value={formData.post} onChange={handleChange} />
                        </div>
                        <div>
                            <button type="button" className={styles.button} onClick={handlePostcode}>우편번호 찾기</button>
                        </div>
                    </div>
                    <div className={styles.addressSection}>
                        <div className={styles.inputContainer}>
                            <input type="text" name="addr1" className={`${styles.input} ${styles.addressInput}`} placeholder="도로명주소" value={formData.addr1} onChange={handleChange} />
                        </div>
                        <div className={styles.inputContainer}>
                            <input type="text" name="addr2" className={`${styles.input} ${styles.addressInput}`} placeholder="지번주소" value={formData.addr2} onChange={handleChange} />
                            <span id="guide" className={styles.guide}></span>
                        </div>
                    </div>
                    <hr />
                    <div className={styles.upload}>
                        <input type="text" className={styles.upload_name} value={formData.branchImage ? formData.branchImage.name : ''} placeholder="사업자등록증등록" readOnly />
                        <label htmlFor="file" className={styles.upload_label}>파일찾기</label>
                        <input type="file" id="file" onChange={handleFileChange} />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={ofName} alt="office name icon" className={styles.icon} />
                        <input type="text" name="branchName" className={styles.input} placeholder="지점명" value={formData.branchName} onChange={handleChange} />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={ofPhone} alt="office phone number icon" className={styles.icon} />
                        <input type="text" name="branchNum" className={styles.input} placeholder="사업자번호" value={formData.branchNum} onChange={handleChange} />
                    </div>
                    <br />
                    <div className={styles.signup}>
                        <input type="submit" value="회원가입" className={styles.btn_signup} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
