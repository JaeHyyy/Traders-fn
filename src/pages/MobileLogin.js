import React, { useState, useEffect } from "react";
import logo from '../assets/logo.png';
import mobileLogin from './MobileLogin.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../util/auth';

const MobileLogin = () => {
    const navigate = useNavigate();

    // Retrieve branchId from the URL or localStorage
    const searchParams = new URLSearchParams(window.location.search);
    const urlBranchId = searchParams.get('branchid'); // Retrieve branchId from URL
    const localStorageBranchId = localStorage.getItem('branchId'); // Retrieve branchId from localStorage
    const urlDate = searchParams.get('date');

    console.log("urlBranchId: ", urlBranchId);
    console.log("localStorageBranchId: ", localStorageBranchId);
    console.log("urlDate: ", urlDate);


    const [credentials, setCredentials] = useState({
        branchId: urlBranchId || localStorageBranchId || '', // Use URL branchId first, then localStorage, then empty string
        passwd: ''
    });

    useEffect(() => {
        // If branchId is found in the URL, update localStorage with it
        if (urlBranchId) {
            localStorage.setItem('branchId', urlBranchId);
        }
    }, [urlBranchId]);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://traders5bootapp.ap-northeast-1.elasticbeanstalk.com/traders/login', credentials)
            .then(response => {
                setAuthToken(response.data.token);

                axios.get(`http://traders5bootapp.ap-northeast-1.elasticbeanstalk.com/traders/branchname/${credentials.branchId}`, {
                    headers: {
                        Authorization: `Bearer ${response.data.token}`
                    }
                })
                    .then(branchResponse => {
                        const branchName = branchResponse.data;

                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('branchId', credentials.branchId);
                        localStorage.setItem('branchName', branchName);

                        const date = searchParams.get('date');

                        // Modified URL creation
                        const navigateUrl = `/mobile/main?branchId=${credentials.branchId}${date ? `&date=${date}` : ''}`;

                        // Redirect to the main page with the correct query parameters
                        navigate(navigateUrl);
                        console.log("지점명: ", branchName);
                        console.log("아이디: ", credentials.branchId);
                        console.log("date: ", date);
                        console.log("token: ", response.data.token);

                    })
                    .catch(error => {
                        console.error('Error fetching branchName:', error);
                        alert('로그인 실패: 지점 이름을 가져오지 못했습니다.');
                    });
            })
            .catch(error => {
                console.error('로그인 중 오류 발생:', error);
                alert('로그인 실패: ' + error.message);
            });
    };

    return (
        <div id={mobileLogin.mobileLogin_page}>
            <form className={mobileLogin.form} onSubmit={handleSubmit}>
                <img src={logo} alt="로고" className={mobileLogin.logo} />
                <input
                    type="text"
                    name="branchId"
                    placeholder="@sample.com"
                    className={mobileLogin.inputField}
                    value={credentials.branchId}
                    onChange={handleChange}
                    readOnly
                />
                <input
                    type="password"
                    name="passwd"
                    placeholder="Password"
                    className={mobileLogin.inputField}
                    value={credentials.passwd}
                    onChange={handleChange}
                />
                <button type="submit" className={mobileLogin.loginButton}>로그인</button>
            </form>
        </div>
    );
}

export default MobileLogin;

