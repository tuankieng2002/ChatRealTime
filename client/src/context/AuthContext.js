import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {

  //lưu dữa liệu vào local storage để khi người dùng tắt trình duyệt thì dữ liệu vẫn còn và khi người dùng mở trình duyệt lên thì dữ liệu vẫn còn và khi người dùng đăng nhập thì dữ liệu vẫn còn
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {//children là các component bên trong AuthContextProvider trong App.js
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  //useReducer là hook để quản lý state, dispatch là hàm để gọi action.payload trong AuthReducer để thay đổi state của context này (AuthContext) và các component bên trong AuthContextProvider

  useEffect(() => {//useEffect là hook để thực hiện một hành động nào đó khi state thay đổi
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);//tham số trong [] là dùng để theo dõi state nào thay đổi thì useEffect sẽ thực hiện hành động nào đó khi state thay [state.user] đổi

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,//isFetching là biến để hiển thị loading khi đang login hoặc register (đang gửi request lên server), true là đang gửi request lên server và false là đã nhận được response từ server
        error: state.error,
        dispatch,//dispatch là hàm để gọi action.payload trong AuthReducer để thay đổi state của context này (AuthContext) và các component bên trong AuthContextProvider
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
