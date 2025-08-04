import { useState } from "react";
import ChatRoom from "./components/ChatRoom";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  if (!joined) {
    return (
      <div className="join-container">
        {/* Background animated blobs */}
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>

        {/* Particles */}
        <div className="particle particle1"></div>
        <div className="particle particle2"></div>
        <div className="particle particle3"></div>
        <div className="particle particle4"></div>

        {/* Pulsing waves */}
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>

        {/* Join form */}
        <div className="join-box">
          <h1 className="title">Welcome to Chatify</h1>
          <p className="subtitle">Real-time chat for everyone, everywhere</p>

          <div className="input-group">
            <input
              id="username"
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="input-group">
            <input
              id="room"
              type="text"
              placeholder=" "
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
              autoComplete="off"
            />
            <label htmlFor="room">Room Name</label>
          </div>

          <button
            className="join-btn"
            onClick={() => {
              if (username.trim() && room.trim()) setJoined(true);
            }}
            aria-label="Join Chat"
          >
            Join Chat
          </button>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Made with 💙 by <span className="glow-text">Shashank Sharma</span></p>
        </footer>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <ChatRoom username={username} room={room} />
    </div>
  );
}
