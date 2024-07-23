import logo from '../assets/logo.png';
import login from './Login.module.css';
import WindowSize from '../components/WindowSize';

function Login() {

    return (
        <div id={login.login_page}>
            <div className={login.login_box}>
                <img src={logo} alt="로고" className={login.logo} />
                <form method="" action="" id={login.login_form}>
                    <input type="text" name="id" placeholder="Email" className={login.input} defaultValue="" /><br />
                    <input type="password" name="password" placeholder="Password" className={login.input} defaultValue="" /><br />
                    <div className={login.form_options}>
                        <label htmlFor="remember-check-id">
                            <input type="checkbox" id="remember-check-id" />아이디 저장하기
                        </label><br />
                        <a href="" className={login.reset_password}>비밀번호 재설정</a>
                    </div><br />
                    <input value="로그인" className={login.btn_login} /><br />
                    <input value="회원가입" className={login.btn_signup} /><br />
                </form>
            </div>
        </div>
    );
}

export default Login;

