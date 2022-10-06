import "./login.css"
import { useRef, useContext } from "react"

import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
//https://mui.com/material-ui/react-progress/
import { CircularProgress } from "@material-ui/core";

export default function Login() {
    const phone = useRef();
    const password = useRef();

    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        //console.log(phone.current.value);
        loginCall({ phone: phone.current.value, password: password.current.value }, dispatch);//phone.current.value là lấy giá trị của input phone, password.current.value là lấy giá trị của input password
    }

    console.log(user);
    console.log(isFetching);

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Message Social</h3>
                    <span className="loginDesc">Connect with friends and the world around you on Message Social</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input
                            className="loginInput"
                            placeholder="Email"
                            type="phone"
                            required
                            ref={phone}
                        />
                        <input
                            className="loginInput"
                            placeholder="Password"
                            type="password"
                            required
                            ref={password}
                            minLength="6"
                        />
                        {/* disabled={isFetching} là khi đang gửi request lên server thì button sẽ bị disable để không cho người dùng click vào button nhiều lần (nếu không sẽ gửi nhiều request lên server) và khi đã nhận được response từ server thì button sẽ được enable để người dùng có thể click vào button để gửi request lên server    */}
                        <button className="loginButton" type="submit" disabled={isFetching}>

                            {isFetching ? <CircularProgress color="white" size="20px" /> : "Log in"}
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="loginRegisterButton">
                            {isFetching ? <CircularProgress color="white" size="20px" /> : "Create a New Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
