import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../util/auth';
import { getAuthToken } from '../util/auth'; //aelin추가
import logo from '../assets/logo.png';
import login from './Login.module.css';

function Login() {
    const [credentials, setCredentials] = useState({ branchId: '', passwd: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const token = getAuthToken(); // token 값 저장 //aelin추가
    const [role, setRole] = useState();

    // useEffect를 사용하여 컴포넌트가 처음 렌더링될 때 localStorage에서 branchId를 가져옴
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
        // axios.post('http://localhost:8090/traders/login', credentials)
        axios.post('http://10.10.10.154:8090/traders/login', credentials)
            .then(response => {
                console.log(response.data);

                // JWT 토큰을 저장
                setAuthToken(response.data.token);

                // branchId를 이용해 서버에서 branchName을 가져옴
                axios.get(`http://10.10.10.154:8090/traders/branchname/${credentials.branchId}`, {
                    // axios.get(`http://localhost:8090/traders/branchname/${credentials.branchId}`, {
                    headers: {
                        Authorization: `Bearer ${response.data.token}`
                    }
                })//aelin추가 여기까지

                    .then(branchResponse => {
                        const branchName = branchResponse.data;

                        // 토큰과 branchId를 localStorage에 저장
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('branchId', credentials.branchId);
                        localStorage.setItem('branchName', branchName);  //aelin추가

                        // 메인 페이지로 이동
                        navigate('/');
                        if (credentials.branchId === 'admin') {
                            navigate('/adminMain');
                        } else {
                            navigate('/');
                        }


                    })
                    .catch(error => {
                        console.error('Error fetching branchName:', error);
                        alert('로그인 실패: 지점 이름을 가져오지 못했습니다.');
                    });
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


