import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid"; // Fix: uuid import alias corrected
import Message from "./Message";

// * Connect to the backend server
const socket = io("http://localhost:3001");

export default function Chat() {
  const [messages, setMessages] = useState([]); // Fix: variable name should be 'messages'
  const [text, setText] = useState(""); // Input value

  // * Setup socket event listeners
  useEffect(() => {
    // * When the server sends all existing messages
    socket.on("initMessage", (msgList) => setMessages(msgList));

    // * When a new message is sent
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // * When a message is edited
    socket.on("updatedMessage", (updated) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
    });

    // * When a message is deleted
    socket.on("removeMessage", (id) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });

    // * Disconnect socket when component unmounts
    return () => socket.disconnect(); // Fix: typo "disconnet" -> "disconnect"
  }, []);

  // * Send message handler
  const handleSend = () => {
    if (text.trim() === "") return;

    const message = {
      id: uuidv4(), // Fix: should be uuidv4() not uuid()
      text,
    };

    socket.emit("sendMessage", message);
    setText("");
  };

  return (
    <div>
      <h2>💬 Chat</h2>

      {/* Message List */}
      <div>
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} socket={socket} />
        ))}
      </div>

      {/* Input and Send Button */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Talk to me..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
