import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
//hình bên trái
//destructure
export default function Conversation({ conversation, currentUser }) {
  const [ user, setUser ] = useState(null);//lúc đầu user = null
  //lúc đầu user = null nên không thể lấy user.full_name được (user.full_name là undefined) nên sẽ bị lỗi (lỗi này không phải lỗi của react mà là lỗi của javascript) nên phải kiểm tra user có tồn tại hay không (user && user.full_name) nếu user tồn tại thì mới lấy user.full_name được (user && user.full_name) nếu user không tồn tại thì sẽ không lấy được user.full_name được (user && user.full_name) nên sẽ không bị lỗi của javascript (user && user.full_name) là cách viết ngắn gọn của (user ? user.full_name : "")


  useEffect(() => {

    const friendId = conversation.members.find((m) => m !== currentUser.data._id);//tìm id của user khác trong conversation (user hiện tại là user đang đăng nhập) m là friendId trong conversation (m !== user._id) là để loại bỏ id của user hiện tại
    //console.log(currentUser.data._id)
    const getUser = async () => {
      try {
        const res = await axios("/users/get-a-user?userId=" + friendId);//lấy thông tin của user khác
        setUser(res.data);
        //console.log(res.data)
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [conversation, currentUser])
  //console.log(user._id)
  return (
    <div className="conversation">
        <img className="conversationImg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Thomas_M%C3%BCller%2C_Germany_national_football_team_%2803%29.jpg/176px-Thomas_M%C3%BCller%2C_Germany_national_football_team_%2803%29.jpg" alt="" />
        <span className="conversationName">{user ? user.full_name : ''}</span>
    </div>
  )
}
