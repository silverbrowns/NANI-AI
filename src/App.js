import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: `NANI: ${data.reply}` },
    ]);
    setIsTyping(false);
  };

  return (
    <div className="app">
      {/* Background with animated gradient + stars */}
      <motion.div
        className="background"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Chat container */}
      <div className="chat-container">
        <div className="header">
          <img src="/siri-logo.svg" alt="Siri Logo" className="siri-logo" />
          <h1 className="title">NANI</h1>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={msg.role === "user" ? "user-msg glass-box" : "bot-msg glass-box"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === "bot" && (
                <div className="nani-avatar">
                  <img src="/siri-logo.svg" alt="NANI" className="logo" />
                  <div className="glow"></div>
                </div>
              )}
              <p>{msg.text}</p>
            </motion.div>
          ))}
          {isTyping && <p className="typing">NANI is typing...</p>}
        </div>

        <div className="input-box glass-box">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
