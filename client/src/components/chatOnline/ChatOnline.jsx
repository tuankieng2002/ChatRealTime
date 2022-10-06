import "./chatOnline.css";

export default function ChatOnline() {
  return (
    <div className="chatOnline">
        <div className="chatOnlineFriend">
            <div className="chatOnlineImgContainer">
                <img className="chatOnlineImg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Thomas_M%C3%BCller%2C_Germany_national_football_team_%2803%29.jpg/176px-Thomas_M%C3%BCller%2C_Germany_national_football_team_%2803%29.jpg" alt="" />
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">Thomas Muller</span>
        </div>
    </div>
  )
}