import "./message.css";
import { format } from "timeago.js";

export default function Message({ own, message }) {
  return (
    <div className={ own ? "message own" : "message"}>
        <div className="messageTop">
            <img className="messageImg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Thomas_M%C3%BCller%2C_Germany_national_football_team_%2803%29.jpg/176px-Thomas_M%C3%BCller%2C_Germany_national_football_team_%2803%29.jpg" alt= "Không load được hình ảnh" />
        </div>
        <p className="messageText">{message.text}</p>

        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}
