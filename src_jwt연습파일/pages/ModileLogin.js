import React from "react";
import logo from '../assets/logo.png';
import mobileLogin from './MobileLogin.module.css';

const MobileLogin = () => {
    return (
        <div id={mobileLogin.mobileLogin_page}>
            <form className={mobileLogin.form}>
                <img src={logo} alt="로고" className={mobileLogin.logo} />
                <input
                    type="text"
                    placeholder="@sample.com"
                    className={mobileLogin.inputField}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={mobileLogin.inputField}
                />
                <button className={mobileLogin.loginButton}>로그인</button>
            </form>
        </div>
    );
}

export default MobileLogin;
