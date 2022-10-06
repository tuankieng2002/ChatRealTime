import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try{
        const res = await axios.post("users/login", userCredentials);
        dispatch({type: "LOGIN_SUCCESS", payload: res.data});
        window.location.replace("/messenger");
    }catch(err){
        dispatch({type: "LOGIN_FAILURE", payload: err});
        console.log(err);
    }
}