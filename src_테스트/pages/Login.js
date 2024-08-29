import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../util/auth';
import logo from '../assets/logo.png';
import login from './Login.module.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ branchId: '', passwd: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedBranchId = localStorage.getItem('branchId');
        if (savedBranchId) {
            setCredentials((prev) => ({ ...prev, branchId: savedBranchId }));
            setRememberMe(true);
        } else {
            setRememberMe(false);
        }
    }, []);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleRememberMeChange = (e) => {
        const isChecked = e.target.checked;
        setRememberMe(isChecked);

        if (isChecked) {
            localStorage.setItem('branchId', credentials.branchId);
        } else {
            localStorage.removeItem('branchId');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8090/traders/login', credentials)
            .then(response => {
                console.log(response.data);

                // JWT 토큰 저장
                setAuthToken(response.data.token);

                // RememberMe 상태에 따라 로컬 스토리지에 저장
                if (rememberMe) {
                    localStorage.setItem('branchId', credentials.branchId);
                } else {
                    localStorage.removeItem('branchId');
                }
                navigate('/');
            })
            .catch(error => {
                console.error('There was an error!', error);
                const errorMessage = error.response ? error.response.data.message : '로그인 실패: 서버와 통신할 수 없습니다.';
                alert(errorMessage);
            });
    };

    return (
        <div id={login.login_page}>
            <div className={login.login_box}>
                <img src={logo} alt="로고" className={login.logo} />
                <form onSubmit={handleSubmit} id={login.login_form}>
                    <input type="text" name="branchId" placeholder="Email" className={login.input} value={credentials.branchId} onChange={handleChange} /><br />
                    <input type="password" name="passwd" placeholder="Password" className={login.input} value={credentials.passwd} onChange={handleChange} /><br />
                    <div className={login.form_options}>
                        <label htmlFor="remember-check-id">
                            <input type="checkbox" id="remember-check-id" checked={rememberMe} onChange={handleRememberMeChange} />
                            아이디 저장하기
                        </label><br />
                        <a href="/reset-password" className={login.reset_password}>비밀번호 재설정</a>
                    </div><br />
                    <input type="submit" value="로그인" className={login.btn_login} /><br />
                    <input type="button" value="회원가입" className={login.btn_signup} onClick={() => navigate('/signup')} /><br />
                </form>
            </div>
        </div>
    );
}

export default Login;
