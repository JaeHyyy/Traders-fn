
import logo from '../assets/logo.png';
import '../pages/Login.css';
import WindowSize from '../components/WindowSize';

function Login() {

    return (
        <div id="login_page">
            <div className='login_box'>
                <img src={logo} alt="로고" className="logo" />
                <form method="" action="" id="login-form">
                    <input type="text" name="id" placeholder="아이디" />
                    <input type="password" name="password" placeholder="Password" />
                    <div className="form-options">
                        <label htmlFor="remember-check-id">
                            <input type="checkbox" id="remember-check-id" />아이디 저장하기
                        </label>
                        <a href="" className="reset-password">비밀번호 재설정</a>
                    </div>
                    <input type="submit" value="로그인" className="btn-login" />
                    <input type="submit" value="회원가입" className="btn-signup" />
                </form>
            </div>
        </div>
    );
}

export default Login;
