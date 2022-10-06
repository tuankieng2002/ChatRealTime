import axios from "axios";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import { AuthContext } from "../../context/AuthContext";
import "./messenger.css"
import { io } from "socket.io-client";


export default function Messenger() {
  const { user } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);//lúc đầu chưa có cuộc trò chuyện nào nên currentChat = null

  const [messages, setMessages] = useState([]);//lấy tin nhắn từ server(tin nhắn của cuộc trò chuyện hiện tại)
  const [newMessage, setNewMessage] = useState("");//gửi tin nhắn lên server(tin nhắn mới server sẽ gửi lại cho client)
  const [arrivalMessage, setArrivalMessage] = useState(null);//lấy tin nhắn từ server

  const scrollRef = useRef();//lấy vị trí cuối cùng của tin nhắn

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8000");//kết nối với server

    socket.current.on("getMessage", (data) => {//lắng nghe sự kiện getMessage từ server

      setArrivalMessage({//lắng nghe tin nhắn từ server và gán vào state arrivalMessage để hiển thị tin nhắn mới nhận được lên màn hình client
        sender: data.senderId,//nhận id của user gửi tin nhắn
        text: data.text,
        createdAt: Date.now(),
      })
    });

  }, []);

  useEffect(() => {
    //currentChat là id conversation(cuộc họp) giữa 2 user
    arrivalMessage &&
    currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage]);//prev là mảng tin nhắn cũ, arrivalMessage là tin nhắn mới nhận được từ server
    console.log(arrivalMessage);
    //toán tử &&: nếu arrivalMessage có giá trị thì thực hiện hàm setMessages

    // if(currentChat?.members.includes(arrivalMessage?.sender)) {
    //   return setMessages((prev) => [...prev, arrivalMessage]);
    // }
    // console.log(arrivalMessage);
  }, [arrivalMessage, currentChat]);


  //socket.io
  useEffect(() => {
    socket.current.emit("addUser", user.data._id);
    socket.current.on("getUsers", (users) => {
      //console.log(users);
    });
  }, [user.data])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user.data._id);//user phải chấm data vì user là 1 object chứa data và token (user.data._id là id của user hiện tại)
        setConversations(res.data.data);
        //console.log(res.data.data)
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user.data._id]);//hàng này là để useEffect chạy 1 lần duy nhất khi component được render lần đầu tiên (nếu không có tham số thứ 2 thì useEffect sẽ chạy liên tục khi component được render) và khi user._id thay đổi thì useEffect sẽ chạy lại


  useEffect(() => {//lấy tin nhắn từ server
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/getConversationId/" + currentChat?._id);//currentChat?._id là id của cuộc trò chuyện hiện tại
        setMessages(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  //gửi tin nhắn lên server
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.data._id,
      text: newMessage,
      conversationId: currentChat._id,
    }

    // console.log(currentChat._id)
    // console.log(user.data._id)
    // console.log(newMessage)

    const receiverId = currentChat.members.find(
      (member) => member !== user.data._id
    );//người nhận tin nhắn là người khác với người gửi(user hiện tại)

    socket.current.emit("sendMessage", {
      senderId: user.data._id,//07e
      receiverId,//090
      text: newMessage//abc
    });

    // console.log("receiverId", receiverId);
     console.log("senderId: "+user.data._id);
     console.log("text gửi: "+ newMessage);

    try {
      const res = await axios.post("/messages/createNew", message);
      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };



  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });//dùng để cuộn xuống dưới cùng của tin nhắn
  }, [messages]);

  return (
    <Fragment>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
                {/* truyền user sang component Conversation để lấy id của user hiện tại để so sánh với id của user trong conversation */}
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {/* <Message own={true} /> */}
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user.data._id} />
                      {/* m.sender === user.data._id chủ sở hữu tin nhắn là user hiện tại */}
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}>
                  </textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Mở một cuộc trò chuyện để bắt đầu một cuộc trò chuyện.
              </span>)}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </Fragment>

  )
}
