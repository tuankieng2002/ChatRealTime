const AuthReducer = (state, action) => {// AuthReducer có 2 tham số: state và action (action là object có 2 thuộc tính: type và payload) => state là state của context này (AuthContext) và các component bên trong AuthContextProvider trong App.js và action là action.payload trong AuthActions.js
  switch (action.type) {//action.type là action mà AuthActions.js trả về
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,//isFetching là biến để hiển thị loading khi đang login hoặc register (đang gửi request lên server), true là đang gửi request lên server và false là đã nhận được response từ server
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    default:
      return state;
  }
};

export default AuthReducer;
