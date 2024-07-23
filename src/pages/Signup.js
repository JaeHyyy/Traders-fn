import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import userIcon from '../assets/user.png'; // Import the user icon as an image
import lockIcon from '../assets/lock.png';
import phoneIcon from '../assets/phone.png';
import ofName from '../assets/officename.png';
import ofPhone from '../assets/officephone.png';
import ofDate from '../assets/calendar.png';
import styles from "./Signup.module.css";

const Signup = () => {
    const [fileName, setFileName] = useState('사업자등록증등록');

    useEffect(() => {
        window.daum = window.daum || {};

        const script = document.createElement('script');
        script.src = "http://dmaps.daum.net/map_js_init/postcode.v2.js";
        script.async = true;
        script.onload = () => {
            window.daum = window.daum || {};
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePostcodeSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    var fullRoadAddr = data.roadAddress;
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
                    if (fullRoadAddr !== '') {
                        fullRoadAddr += extraRoadAddr;
                    }

                    document.getElementById('postcode').value = data.zonecode;
                    document.getElementById('roadAddress').value = fullRoadAddr;
                    document.getElementById('jibunAddress').value = data.jibunAddress;

                    if (data.autoRoadAddress) {
                        var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                        document.getElementById('guide').innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                    } else if (data.autoJibunAddress) {
                        var expJibunAddr = data.autoJibunAddress;
                        document.getElementById('guide').innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                    } else {
                        document.getElementById('guide').innerHTML = '';
                    }
                }
            }).open();
        } else {
            console.error('Daum 우편번호 API가 로드되지 않았습니다.');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : '사업자등록증등록');
    };

    return (
        <div id={styles.signup_page}>
            <div className={styles.signup_box}>
                <form method="" action="" id={styles.signup_form}>
                    <img src={logo} alt="로고" className={styles.logo} />

                    <div className={styles.inputContainer}>
                        <img src={userIcon} alt="user icon" className={styles.icon} />
                        <input type="text" name="id" placeholder="@sample.com" className={styles.input} defaultValue="" />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={lockIcon} alt="lock icon" className={styles.icon} />
                        <input type="password" name="password" placeholder="Password" className={styles.input} defaultValue="" />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={phoneIcon} alt="phone icon" className={styles.icon} />
                        <input type="tel" name="phonenumber" placeholder="'-' 없이 입력해주세요." className={styles.input} defaultValue="" />
                    </div>
                    <br />
                    <hr />
                    <div className={styles.addressSection}>
                        <div className={styles.inputContainer}>
                            <input type="text" name="postcode" id="postcode" className={`${styles.input} ${styles.addressInput}`} placeholder="우편번호" />
                        </div>
                        <div>
                            <button type="button" className={styles.button} onClick={handlePostcodeSearch}>우편번호 찾기</button>
                        </div>
                    </div>
                    <div className={styles.addressSection}>
                        <div className={styles.inputContainer}>
                            <input type="text" name="roadAddress" id="roadAddress" className={`${styles.input} ${styles.addressInput}`} placeholder="도로명주소" />
                        </div>
                        <div className={styles.inputContainer}>
                            <input type="text" name="jibunAddress" id="jibunAddress" className={`${styles.input} ${styles.addressInput}`} placeholder="지번주소" />
                            <span id="guide" className={styles.guide}></span>
                        </div>
                    </div>
                    <hr />
                    <div className={styles.upload}>
                        <input type="text" className={styles.upload_name} value={fileName} placeholder="사업자등록증등록" readOnly />
                        <label htmlFor="file" className={styles.upload_label}>파일찾기</label>
                        <input type="file" id="file" onChange={handleFileChange} />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={ofName} alt="office name icon" className={styles.icon} />
                        <input type="text" name="branchName" id="branchName" className={styles.input} placeholder="지점명" />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={ofDate} alt="office date icon" className={styles.icon} />
                        <input type="text" name="issuedate" id="issuedate" className={styles.input} placeholder="발급일" />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={ofPhone} alt="office phone number icon" className={styles.icon} />
                        <input type="text" name="businessNumber" id="businessNumber" className={styles.input} placeholder="사업자번호" />
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
