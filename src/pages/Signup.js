import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import userIcon from '../assets/user.png';
import lockIcon from '../assets/lock.png';
import phoneIcon from '../assets/phone.png';
import ofName from '../assets/officename.png';
import ofPhone from '../assets/officephone.png';
import styles from "./Signup.module.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        branchId: '',
        passwd: '',
        branchName: '',
        nickname: '',
        branchNum: '',
        branchImage: '',
        post: '',
        addr1: '',
        addr2: '',
        phoneNum: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8090/traders/signup', formData)
            .then(response => {
                console.log(response.data);
                alert('회원가입 성공');
                navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
            })
            .catch(error => {
                console.error('There was an error!', error);
                alert('회원가입 실패: ' + error.message);
            });
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
                            <button type="button" className={styles.button}>우편번호 찾기</button>
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
                        <input type="text" className={styles.upload_name} value={formData.branchImage} placeholder="사업자등록증등록" readOnly />
                        <label htmlFor="file" className={styles.upload_label}>파일찾기</label>
                        <input type="file" id="file" onChange={(e) => setFormData({ ...formData, branchImage: e.target.files[0].name })} />
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
