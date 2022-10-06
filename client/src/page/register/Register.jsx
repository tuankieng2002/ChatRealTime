import axios from "axios";
import { useRef } from "react";
import { useHistory } from "react-router-dom";

import "./register.css";

export const Register = () => {
  const phone = useRef();
  const password = useRef();
  const full_name = useRef();
  const email = useRef();
  const address = useRef();

  const history = useHistory(); //useHistory() là hook của react-router-dom để chuyển hướng trang web (tương tự như thẻ <a> trong html) https://reactrouter.com/web/api/Hooks/usehistory

  const handleClick = async (e) => {
    e.preventDefault();

    const user = {
      phone: phone.current.value,
      password: password.current.value,
      full_name: full_name.current.value,
      email: email.current.value,
      address: address.current.value,
    };

    try {
      await axios.post("users/register", user);
      history.push("/login");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Message Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Message Social
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="text"
              className="loginInput"
              placeholder="Full Name"
              required
              ref={full_name}
            />
            <input
              type="email"
              className="loginInput"
              placeholder="Email"
              required
              ref={email}
            />
            <input
              type="text"
              className="loginInput"
              placeholder="Address"
              required
              ref={address}
            />
            <input
              type="text"
              className="loginInput"
              placeholder="Phone"
              required
              ref={phone}
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Password"
              minLength="6"
              required
              ref={password}
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton">Log into account</button>
          </form>
        </div>
      </div>
    </div>
  );
};
