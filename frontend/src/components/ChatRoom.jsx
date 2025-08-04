import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";

export default function ChatRoom({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const ws = useRef(null);
  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "join", username, room }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        setMessages((prev) => {
          if (
            prev.some(
              (m) =>
                m.timestamp === data.timestamp &&
                m.username === data.username &&
                m.content === data.content
            )
          )
            return prev;
          return [...prev, data];
        });
      } else if (data.type === "typing") {
        if (data.username !== username) {
          setTypingUsers((prev) => {
            if (!prev.includes(data.username)) {
              return [...prev, data.username];
            }
            return prev;
          });

          if (typingTimeout.current) clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => {
            setTypingUsers((prev) => prev.filter((u) => u !== data.username));
          }, 3000);
        }
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current.close();
    };
  }, [username, room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      type: "message",
      username,
      room,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);

    ws.current.send(JSON.stringify(message));
    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    ws.current.send(JSON.stringify({ type: "typing", username, room }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatroom-wrapper">
      <div className="floating-blobs">
        <div className="floating-blob"></div>
        <div className="floating-blob"></div>
        <div className="floating-blob"></div>
      </div>

      <div className="chatroom-container">
        <header className="chat-header">
          Room: {room} | User: {username}
        </header>

        <main className="chat-messages">
          {messages.map((msg, idx) => {
            if (msg.username === "System") {
              return (
                <div key={idx} className="chat-system-message">
                  {msg.content}
                </div>
              );
            }

            const isSender = msg.username === username;

            return (
              <div
                key={idx}
                className={`chat-message ${isSender ? "sender" : "receiver"}`}
              >
                <div className="chat-bubble">
                  <div className="chat-username">{msg.username}</div>
                  <div className="chat-text">{msg.content}</div>
                  <div className="chat-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
            </div>
          )}
        </main>

        <footer className="chat-input-area">
          <textarea
            rows={3}
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="chat-input"
          />
          <button onClick={sendMessage} className="chat-send-btn">
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}
