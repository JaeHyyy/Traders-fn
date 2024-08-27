import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../util/api';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
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
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


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

    const openDialog = () => {
        setIsDialogVisible(true);
    };

    const closeDialog = () => {
        setIsDialogVisible(false);
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        try {
            const validateResponse = await api.get(`/traders/validatePassword`, {
                params: {
                    branchId: formData.branchId,
                    passwd: currentPassword,
                }
            });

            if (validateResponse.data.valid) {
                const changeResponse = await api.post('/traders/changePassword', {
                    branchId: formData.branchId,
                    passwd: newPassword,
                });

                if (changeResponse.data === "Password changed successfully") {
                    alert("비밀번호가 성공적으로 변경되었습니다.");
                    closeDialog();
                } else {
                    alert("비밀번호 변경 실패: " + changeResponse.data);
                }
            } else {
                alert("현재 비밀번호가 올바르지 않습니다.");
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('비밀번호 변경 중 오류가 발생했습니다.');
        }
    };

    const footerContent = (
        <div>
            <Button label="확인" icon="pi pi-check" onClick={handlePasswordChange} className={styles.o} />
            <Button label="취소" icon="pi pi-times" onClick={closeDialog} className={styles.x} />
        </div>
    );




    return (
        <div className={styles.mypage}>
            <div className={styles.signup_page}>
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
                        <button type="basic" className={styles.btn_changepw} onClick={openDialog}>비밀번호 변경</button>
                    </div>
                </div>
                <Dialog visible={isDialogVisible} modal footer={footerContent} style={{ width: '30rem' }} onHide={closeDialog} className={styles.dialogPadding}>
                    <h2 className={styles.dtitle}> 비밀 번호 변경</h2>
                    <div className={styles.dialogContent}>
                        <div className={styles.newpw}>
                            <InputText
                                id="currentPassword"
                                type="password"
                                placeholder="현재 비밀번호"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={styles.newpasswd}
                            />
                        </div>
                        <div className={styles.newpw}>
                            <InputText
                                id="newPassword"
                                type="password"
                                placeholder="새로운 비밀번호"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.newpasswd}
                            />
                        </div>
                        <div className={styles.newpw}>
                            <InputText
                                id="confirmPassword"
                                type="password"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.newpasswd}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default MyPage;