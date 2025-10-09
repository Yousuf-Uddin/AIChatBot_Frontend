/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import ChatWidgetIcon from "./assets/ChatbotLogo.svg";
import BotIcon from "./assets/Bot.svg";
import UserIcon from "./assets/User.svg";
import LordsLogo from "./assets/LordsLogo.png";
import Tooltip from "./assets/tooltip.svg";
import axios from "axios";

const ChatbotWidget = ({ position = "bottom-right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      axios
        .get("http://localhost:5000/")
        .then((res) => {
          console.log(res.data);
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: res.data || "Sorry, I didn't understand that.",
            },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Error connecting to server." },
          ]);
        });
      initialized.current = true;
    }
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setBotTyping(true); // Show typing indicator

    // Send user message to backend and show bot response using axios
    axios
      .post("http://localhost:5000/chat", {
        message: newMessage.text,
      })
      .then((res) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: res.data || "Sorry, I didn't understand that.",
          },
        ]);
        setBotTyping(false); // Hide typing indicator
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Error connecting to server." },
        ]);
        setBotTyping(false); // Hide typing indicator
      });
  };

  return (
    <div
      className={`fixed ${
        position === "bottom-right" ? "bottom-4 right-4" : "bottom-4 left-4"
      } z-50`}
    >
      {!isOpen && (
        <div className="relative inline-block ">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-full shadow-lg text-white"
            onMouseEnter={() => setShowBubble(true)}
            onMouseLeave={() => setShowBubble(false)}
          >
            <img src={ChatWidgetIcon} alt="Chatbot" width={60} />
          </button>
          {showBubble && (
            <div className="absolute w-[80vw] top-2 -left-39 items-center z-50">
              <img src={Tooltip} alt="tooltip" width={160} />
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-100 h-150 bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden border border-gray-200`}
        >
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <img src={LordsLogo} alt="Chatbot" width={34} />
              Lords Chatbot
            </span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-start text-black">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-baseline gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <img src={BotIcon} className=" my-1" alt="Bot" width={30} />
                )}
                <div
                  className={`p-2 px-4 rounded-xl w-fit text-sm shadow ${
                    msg.sender === "user"
                      ? "bg-blue-100 self-end ml-auto"
                      : "bg-gray-100 self-start mr-auto"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <img src={UserIcon} className=" my-1" alt="User" width={30} />
                )}
              </div>
            ))}
            {botTyping && (
              <div className="flex items-baseline gap-2 ">
                <img src={BotIcon} className="my-1" alt="Bot" width={30} />
                <div className=" px-4 rounded-xl text-3xl w-fit text-black shadow bg-gray-100 self-center mr-auto animate-pulse">
                  ...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 flex border-t text-black">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your query here..."
              className="flex-1 px-3 py-2 border rounded-xl focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Embed initializer
window.ChatbotWidget = {
  init: (config) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(<ChatbotWidget {...config} />);
  },
};

export default ChatbotWidget;
