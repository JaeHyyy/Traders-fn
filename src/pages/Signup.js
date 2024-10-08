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
import { FileUpload } from 'primereact/fileupload';
import styled from 'styled-components';

// OCR 라이브러리 css 수정
const StyledUploadContainer = styled.div`
  .p-fileupload {
    width: 100%; // 부모 컨테이너에 맞게 너비 조정
  }

  .p-fileupload-row {
    font-size: 13px;
    background-color: #F8F8F8;
  }

  .p-fileupload-buttonbar {
    display: flex;
    justify-content: flex-start;
    background-color: #F8F8F8;
   
  }

    .p-button.p-fileupload-choose.p-component {
    background-color: #AADA2A ;
    border: none;
    padding: 5px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px; 
    color: #ffffff;
    outline: none;
    box-shadow: none;  
  }

  .p-button.p-fileupload-choose.p-component:hover {
    background-color: #133A00 ; /* 호버 시 색상 */
  }
  
  .p-fileupload-content {
    width: 100%;
  }

 .p-badge {
    &.p-badge-warning {
      background-color: ${(props) => (props.isPending ? '#CCCCCC' : '#aada2a')}; /* 조건에 따라 배경색 변경 */
    }
    size: 10px;
    margin-left: 10px;
  }

.p-fileupload-filename {
    display: inline-block; /* 인라인 블록으로 설정하여 가로 정렬 */
    font-size: 13.5px; 
    margin-right: 10px; 
}

.p-fileupload-filesize {
    font-size: 5px;
    display: inline-block; 
}

.m-0{
    font-size: 13px;
    padding: 5px 15px;
    color: #7F7D7D;
    background-color: #F8F8F8;
}

`;

const Signup = () => {
    const [formData, setFormData] = useState({
        branchId: '',
        passwd: '',
        branchName: '',
        branchNum: '',
        branchImage: null, // 파일을 null로 초기화
        post: '',
        addr1: '',
        addr2: '',
        phoneNum: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [fileName, setFileName] = useState('');
    const [isPending, setIsPending] = useState(true);

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


    const handleFileUpload = async (e) => {
        const file = e.files[0];
        setFormData({
            ...formData,
            branchImage: file
        });

        const ocrFormData = new FormData();
        ocrFormData.append('theFile', file);

        try {
            const response = await axios.post('http://traders5bootapp.ap-northeast-1.elasticbeanstalk.com/traders/uploadForm/uploadOcr', ocrFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const ocrData = response.data.parseData;
            const branchName = response.data.branchName;

            setFormData((prevFormData) => ({
                ...prevFormData,
                branchName: branchName || "",
            }));

            const businessNumber = ocrData.find(text => /\d{3}-\d{2}-\d{5}/.test(text));
            if (businessNumber) {
                setFormData(prevState => ({
                    ...prevState,
                    branchNum: businessNumber.replace(/-/g, '')
                }));
            }
            // OCR 완료 후 파일 이름과 상태를 업데이트
            setFileName(file.name);
            setIsPending(false); // OCR 완료 후 'clear' 상태로 변경

            // 상태를 'clear'로 표시하기 위해 텍스트 업데이트
            const badgeElement = document.querySelector('.p-fileupload-file-badge');
            if (badgeElement) {
                badgeElement.textContent = 'clear'; // 텍스트를 'clear'로 변경
            }
        } catch (error) {
            console.error('OCR 처리 중 오류가 발생했습니다.', error);
        }
    };

    //ocr 등록 파일 삭제 시 지점명 & 사업자번호 함께 초기화
    const handleRemove = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            branchName: '',
            branchNum: '',
            branchImage: null
        }));
        setIsPending(true); // pending 상태로 되돌리기
    };



    const validateFields = () => {
        const newErrors = {};

        // 이메일 (branchId) 유효성 검사
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.branchId)) {
            newErrors.branchId = '· 유효하지 않은 이메일 형식입니다.';
        }

        // 비밀번호 (passwd) 유효성 검사
        if (formData.passwd.length < 6) {
            newErrors.passwd = '· 비밀번호는 최소 6자리 이상이어야 합니다.';
        }

        // 전화번호 (phoneNum) 유효성 검사
        if (!/^\d+$/.test(formData.phoneNum)) {
            newErrors.phoneNum = '· 전화번호는 숫자만 포함해야 합니다.';
        }

        // 주소 (addr1) 유효성 검사
        if (!formData.post || !formData.addr1) {
            newErrors.address = '· 유효한 주소를 입력해주세요.';
        }

        // 지점 정보 (branchName, branchNum) 유효성 검사
        if (!formData.branchName || !formData.branchNum) {
            newErrors.branchDetails = '· 유효한 사업자 등록증을 업로드해주세요.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        return true;
    };




    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateFields()) {
            // 유효성 검사 실패 시 폼 제출 중단
            return;
        }

        const data = new FormData();
        data.append('branchId', formData.branchId);
        data.append('passwd', formData.passwd);
        data.append('branchName', formData.branchName);
        data.append('branchNum', formData.branchNum);
        data.append('post', formData.post);
        data.append('addr1', formData.addr1);
        data.append('addr2', formData.addr2);
        data.append('phoneNum', formData.phoneNum);

        if (formData.branchImage) {
            data.append('branchImage', formData.branchImage);
        }

        axios.post('http://traders5bootapp.ap-northeast-1.elasticbeanstalk.com/traders/signup', data, {
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
                        <img src={userIcon} alt="user icon" className={`${styles.icon} ${errors.branchId && 'error-icon'}`} />
                        <input
                            type="text"
                            name="branchId"
                            placeholder="@sample.com"
                            className={`${styles.input} ${errors.branchId && styles.error}`}
                            value={formData.branchId}
                            onChange={handleChange}
                        />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={lockIcon} alt="lock icon" className={`${styles.icon} ${errors.passwd && 'error-icon'}`} />
                        <input
                            type="password"
                            name="passwd"
                            placeholder="Password"
                            className={`${styles.input} ${errors.passwd && styles.error}`}
                            value={formData.passwd}
                            onChange={handleChange}
                        />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={phoneIcon} alt="phone icon" className={`${styles.icon} ${errors.phoneNum && 'error-icon'}`} />
                        <input
                            type="tel"
                            name="phoneNum"
                            placeholder="'-' 없이 입력해주세요."
                            className={`${styles.input} ${errors.phoneNum && styles.error}`}
                            value={formData.phoneNum}
                            onChange={handleChange}
                        />
                    </div>


                    <br />
                    {errors.branchId && <p className={styles.errorMessage}>{errors.branchId}</p>}
                    {errors.passwd && <p className={styles.errorMessage}>{errors.passwd}</p>}
                    {errors.phoneNum && <p className={styles.errorMessage}>{errors.phoneNum}</p>}

                    <hr />
                    <div className={styles.addressSection}>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                name="post"
                                className={`${styles.input} ${styles.addressInput} ${errors.address && styles.error}`}
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
                                className={`${styles.input} ${styles.addressInput} ${errors.address && styles.error}`}
                                placeholder="도로명주소"
                                value={formData.addr1}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                name="addr2"
                                className={`${styles.input} ${styles.addressInput} ${errors.address && styles.error}`}
                                placeholder="지번주소"
                                value={formData.addr2}
                                onChange={handleChange}
                            />
                            <span id="guide" className={styles.guide}></span>
                        </div>
                    </div>
                    {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
                    <hr />
                    <StyledUploadContainer className={styles.upload} isPending={isPending}>
                        <FileUpload
                            name="branchImage"
                            url=""
                            accept="image/*"
                            maxFileSize={1000000}
                            auto
                            customUpload
                            chooseLabel="파일찾기"
                            uploadHandler={handleFileUpload}
                            emptyTemplate={<p className="m-0">사업자등록증 파일을 업로드 하세요.</p>}
                            onRemove={handleRemove}
                        />
                    </StyledUploadContainer>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={ofName} alt="office name icon" className={`${styles.icon} ${errors.branchDetails && 'error-icon'}`} />
                        <input
                            type="text"
                            name="branchName"
                            className={`${styles.input} ${errors.branchDetails && styles.error}`}
                            placeholder="지점명"
                            value={formData.branchName}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <br />
                    <div className={styles.inputContainer}>
                        <img src={ofPhone} alt="office phone number icon" className={`${styles.icon} ${errors.branchDetails && 'error-icon'}`} />
                        <input
                            type="text"
                            name="branchNum"
                            className={`${styles.input} ${errors.branchDetails && styles.error}`}
                            placeholder="사업자번호"
                            value={formData.branchNum}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    {errors.branchDetails && <p className={styles.errorMessage}>{errors.branchDetails}</p>}
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
