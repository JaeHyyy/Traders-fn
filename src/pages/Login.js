import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import login from './Login.module.css';

function Login() {
    const [credentials, setCredentials] = useState({ branchId: '', passwd: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedBranchId = localStorage.getItem('branchId');
        if (savedBranchId) {
            setCredentials((prev) => ({ ...prev, branchId: savedBranchId }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8090/traders/login', credentials)
            .then(response => {
                console.log(response.data);
                if (rememberMe) {
                    localStorage.setItem('branchId', credentials.branchId);
                } else {
                    localStorage.removeItem('branchId');
                }
                navigate('/');
            })
            .catch(error => {
                console.error('There was an error!', error);
                alert('로그인 실패: ' + error.message);
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
                            <input type="checkbox" id="remember-check-id" checked={rememberMe} onChange={handleRememberMeChange} />아이디 저장하기
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
